# 🌐 Black Trigram (흑괘) Future Data Model

## 📚 Related Documentation

| Document                                              | Focus                | Description                                           |
| ----------------------------------------------------- | -------------------- | ----------------------------------------------------- |
| [Data Model](DATA_MODEL.md)                           | 📊 Current Types     | TypeScript type system and session-only storage       |
| [Future Architecture](FUTURE_ARCHITECTURE.md)         | 🏛️ Cloud Design      | AWS infrastructure and backend services               |
| [Security Architecture](SECURITY_ARCHITECTURE.md)     | 🔒 Current Security  | Security controls for frontend-only application       |
| [Future Security Architecture](FUTURE_SECURITY_ARCHITECTURE.md) | 🛡️ Cloud Security | Security architecture for AWS backend integration |

---

## 🎯 Overview

This document defines the future data model for Black Trigram when transitioning from a frontend-only application to a cloud-backed platform with AWS DynamoDB for player data persistence, authentication via AWS Cognito, and payment processing through Stripe.

### **Migration Timeline**

- **Q2 2026**: Dual-write implementation (session + DynamoDB)
- **Q3 2026**: DynamoDB becomes primary data source
- **Q4 2026**: Full cloud persistence with offline sync

### **Design Principles**

- ✅ **Single-Table Design**: DynamoDB best practice for access patterns
- ✅ **GDPR Compliance**: Right to erasure, data portability
- ✅ **Encryption Everywhere**: At rest (KMS) and in transit (TLS 1.3)
- ✅ **Audit Logging**: DynamoDB Streams + CloudTrail integration
- ✅ **Data Versioning**: Forward/backward compatibility
- ✅ **Access Control**: AWS IAM least privilege policies

---

## 🗄️ DynamoDB Table Schemas

### **Single-Table Design Strategy**

Black Trigram uses a single DynamoDB table with composite keys for efficient data access and cost optimization.

```mermaid
erDiagram
    PLAYER_TABLE ||--o{ PLAYER_PROFILE : contains
    PLAYER_TABLE ||--o{ GAME_STATE : contains
    PLAYER_TABLE ||--o{ ACHIEVEMENT : contains
    PLAYER_TABLE ||--o{ PURCHASE : contains
    PLAYER_TABLE ||--o{ LEADERBOARD_ENTRY : contains
    
    PLAYER_PROFILE {
        string PK
        string SK
        string userId
        string username
        string email
        string cognitoSub
        string archetype
        number level
        number experience
        string createdAt
        string lastLogin
    }
    
    GAME_STATE {
        string PK
        string SK
        string userId
        json stanceData
        json vitalPointProgress
        json equipment
        number version
        string timestamp
    }
    
    ACHIEVEMENT {
        string PK
        string SK
        string achievementId
        string unlockedAt
        number progress
    }
    
    PURCHASE {
        string PK
        string SK
        string purchaseId
        string stripeSessionId
        number amount
        string status
    }
    
    LEADERBOARD_ENTRY {
        string GSI1PK
        string GSI1SK
        string userId
        number score
        string archetype
    }
```

---

## 📊 Table Structure: BlackTrigramData

### **Primary Keys**

```typescript
interface BlackTrigramDataItem {
  // Partition Key: Entity type + ID
  PK: string;  // Format: "PLAYER#<userId>" | "GAME#<gameId>" | "ACHIEVEMENT#<achievementId>"
  
  // Sort Key: Sub-entity type + ID/timestamp
  SK: string;  // Format: "PROFILE" | "GAMESTATE#<timestamp>" | "ACHIEVEMENT#<achievementId>" | "PURCHASE#<purchaseId>"
  
  // Attributes (entity-specific)
  [key: string]: any;
}
```

### **Access Patterns**

| Access Pattern | Keys Used | GSI Required |
|----------------|-----------|--------------|
| Get player profile | PK=PLAYER#userId, SK=PROFILE | No |
| Get player game states | PK=PLAYER#userId, SK begins_with GAMESTATE# | No |
| Get player achievements | PK=PLAYER#userId, SK begins_with ACHIEVEMENT# | No |
| Get player purchases | PK=PLAYER#userId, SK begins_with PURCHASE# | No |
| Query leaderboard by archetype | GSI1PK=LEADERBOARD#archetype, GSI1SK=SCORE#-score | Yes (GSI1) |
| Query achievements by unlock date | GSI2PK=ACHIEVEMENTS, GSI2SK=DATE#date | Yes (GSI2) |

---

## 👤 Player Profile Schema

### **TypeScript Interface**

```typescript
/**
 * Player profile stored in DynamoDB
 * 플레이어 프로필 (Player Profile)
 */
export interface PlayerProfileItem {
  // Primary Keys
  readonly PK: `PLAYER#${string}`;  // PLAYER#<userId>
  readonly SK: "PROFILE";
  
  // Player Identity
  readonly userId: string;           // UUID v4
  readonly username: string;         // Display name (unique)
  readonly email: string;            // Email address (unique)
  readonly cognitoSub: string;       // AWS Cognito user ID
  
  // Profile Data
  readonly archetype: PlayerArchetype;  // Combat archetype
  readonly level: number;               // Player level (1-100)
  readonly experience: number;          // Total XP earned
  readonly totalPlayTime: number;       // Total seconds played
  
  // Statistics
  readonly matchesPlayed: number;
  readonly matchesWon: number;
  readonly totalDamageDealt: number;
  readonly totalDamageReceived: number;
  readonly vitalPointHits: number;
  readonly perfectStrikes: number;
  
  // Timestamps
  readonly createdAt: string;        // ISO 8601 timestamp
  readonly updatedAt: string;        // ISO 8601 timestamp
  readonly lastLogin: string;        // ISO 8601 timestamp
  
  // Data Version
  readonly version: number;          // Schema version (for migrations)
  readonly dataVersion: string;      // Semantic version (e.g., "1.0.0")
  
  // GSI Attributes (for leaderboard queries)
  readonly GSI1PK?: `LEADERBOARD#${string}`;  // LEADERBOARD#<archetype>
  readonly GSI1SK?: `SCORE#${number}`;        // SCORE#-123456 (negative for desc sort)
}
```

### **Example Item**

```json
{
  "PK": "PLAYER#550e8400-e29b-41d4-a716-446655440000",
  "SK": "PROFILE",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "ShadowFist_KR",
  "email": "player@example.com",
  "cognitoSub": "cognito-uuid-12345",
  "archetype": "amsalja",
  "level": 15,
  "experience": 45000,
  "totalPlayTime": 36000,
  "matchesPlayed": 120,
  "matchesWon": 78,
  "totalDamageDealt": 145000,
  "totalDamageReceived": 92000,
  "vitalPointHits": 234,
  "perfectStrikes": 45,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-25T12:00:00Z",
  "lastLogin": "2026-01-25T11:30:00Z",
  "version": 1,
  "dataVersion": "1.0.0",
  "GSI1PK": "LEADERBOARD#amsalja",
  "GSI1SK": "SCORE#-145000"
}
```

---

## 🎮 Game State Schema

### **TypeScript Interface**

```typescript
/**
 * Game state snapshot stored in DynamoDB
 * 게임 상태 (Game State)
 */
export interface GameStateItem {
  // Primary Keys
  readonly PK: `PLAYER#${string}`;       // PLAYER#<userId>
  readonly SK: `GAMESTATE#${string}`;    // GAMESTATE#<timestamp>
  
  // Game State Data
  readonly userId: string;
  readonly gameStateId: string;          // UUID for this game state
  
  // Combat State
  readonly currentStance: TrigramStance;
  readonly health: number;
  readonly maxHealth: number;
  readonly ki: number;
  readonly maxKi: number;
  readonly stamina: number;
  readonly maxStamina: number;
  
  // Stance Progress
  readonly stanceData: readonly {
    readonly stance: TrigramStance;
    readonly masteryLevel: number;      // 0-100
    readonly techniquesUnlocked: readonly string[];
    readonly practiceTime: number;      // seconds
  }[];
  
  // Vital Point Progress
  readonly vitalPointProgress: readonly {
    readonly vitalPointId: string;
    readonly timesHit: number;
    readonly successRate: number;       // 0.0-1.0
    readonly bestAccuracy: number;      // 0.0-1.0
  }[];
  
  // Equipment/Cosmetics
  readonly equipment: readonly {
    readonly slot: string;
    readonly itemId: string;
    readonly purchasedAt: string;
  }[];
  
  // Match Context (if saved during match)
  readonly isInMatch: boolean;
  readonly opponentArchetype?: PlayerArchetype;
  readonly matchStartTime?: string;
  
  // Metadata
  readonly timestamp: string;            // ISO 8601
  readonly version: number;              // Schema version
  readonly dataVersion: string;          // Semantic version
  
  // Compression flag (for large game states)
  readonly compressed?: boolean;
  readonly compressionAlgo?: "gzip" | "brotli";
}
```

---

## 🏆 Achievement Schema

### **TypeScript Interface**

```typescript
/**
 * Player achievement record in DynamoDB
 * 업적 (Achievement)
 */
export interface AchievementItem {
  // Primary Keys
  readonly PK: `PLAYER#${string}`;         // PLAYER#<userId>
  readonly SK: `ACHIEVEMENT#${string}`;    // ACHIEVEMENT#<achievementId>
  
  // Achievement Data
  readonly userId: string;
  readonly achievementId: string;          // e.g., "vital_point_master_50"
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly category: AchievementCategory;
  
  // Progress Tracking
  readonly progress: number;               // Current progress (0-100)
  readonly requiredProgress: number;       // Target for completion
  readonly isUnlocked: boolean;
  readonly unlockedAt?: string;            // ISO 8601 timestamp
  
  // Rewards
  readonly rewards: {
    readonly experience: number;
    readonly items?: readonly string[];    // Item IDs
    readonly title?: KoreanText;
  };
  
  // Metadata
  readonly version: number;
  
  // GSI Attributes (for achievement listing)
  readonly GSI2PK?: "ACHIEVEMENTS";
  readonly GSI2SK?: `DATE#${string}`;      // DATE#<unlockedAt> for sorting
}

export enum AchievementCategory {
  COMBAT = "combat",              // 전투 - Combat achievements
  VITAL_POINTS = "vital_points",  // 급소 - Vital point targeting
  STANCES = "stances",            // 자세 - Stance mastery
  MATCHES = "matches",            // 경기 - Match victories
  TRAINING = "training",          // 훈련 - Training progress
  COLLECTION = "collection",      // 수집 - Item collection
}
```

---

## 💳 Purchase Schema (Stripe Integration)

### **TypeScript Interface**

```typescript
/**
 * Stripe purchase record in DynamoDB
 * 구매 기록 (Purchase Record)
 */
export interface PurchaseItem {
  // Primary Keys
  readonly PK: `PLAYER#${string}`;       // PLAYER#<userId>
  readonly SK: `PURCHASE#${string}`;     // PURCHASE#<purchaseId>
  
  // Purchase Identity
  readonly userId: string;
  readonly purchaseId: string;           // UUID
  readonly stripeSessionId: string;      // Stripe Checkout Session ID
  readonly stripePaymentIntentId?: string; // Stripe Payment Intent ID
  
  // Purchase Details
  readonly items: readonly {
    readonly itemId: string;
    readonly itemType: "cosmetic" | "bundle" | "premium";
    readonly quantity: number;
    readonly pricePerUnit: number;      // In cents
  }[];
  
  // Payment Info
  readonly amount: number;               // Total in cents
  readonly currency: string;             // ISO 4217 (e.g., "USD", "EUR")
  readonly status: PurchaseStatus;
  
  // Timestamps
  readonly createdAt: string;            // ISO 8601
  readonly completedAt?: string;         // ISO 8601
  readonly refundedAt?: string;          // ISO 8601
  
  // Metadata
  readonly version: number;
  
  // GSI Attributes (for purchase history queries)
  readonly GSI3PK?: "PURCHASES";
  readonly GSI3SK?: `DATE#${string}`;    // DATE#<createdAt>
}

export enum PurchaseStatus {
  PENDING = "pending",       // 대기중 - Awaiting payment
  COMPLETED = "completed",   // 완료 - Payment successful
  FAILED = "failed",         // 실패 - Payment failed
  REFUNDED = "refunded",     // 환불 - Refund processed
  EXPIRED = "expired",       // 만료 - Session expired
}
```

---

## 📈 Global Secondary Indexes (GSIs)

### **GSI1: Leaderboard Index**

**Purpose**: Query leaderboards by archetype and score

```typescript
interface GSI1 {
  readonly GSI1PK: `LEADERBOARD#${PlayerArchetype}`;
  readonly GSI1SK: `SCORE#${number}`;  // Negative for descending sort
  
  // Projected attributes
  readonly userId: string;
  readonly username: string;
  readonly score: number;
  readonly archetype: PlayerArchetype;
  readonly level: number;
}
```

**Access Pattern**:
```typescript
// Query top 10 players for "amsalja" archetype
const params = {
  TableName: "BlackTrigramData",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :pk",
  ExpressionAttributeValues: {
    ":pk": "LEADERBOARD#amsalja"
  },
  Limit: 10,
  ScanIndexForward: true  // Ascending = highest scores first (due to negative)
};
```

### **GSI2: Achievement Timeline Index**

**Purpose**: Query achievements by unlock date across all players

```typescript
interface GSI2 {
  readonly GSI2PK: "ACHIEVEMENTS";
  readonly GSI2SK: `DATE#${string}`;  // DATE#<ISO 8601 timestamp>
  
  // Projected attributes
  readonly userId: string;
  readonly username: string;
  readonly achievementId: string;
  readonly achievementName: KoreanText;
  readonly unlockedAt: string;
}
```

### **GSI3: Purchase History Index**

**Purpose**: Query all purchases chronologically

```typescript
interface GSI3 {
  readonly GSI3PK: "PURCHASES";
  readonly GSI3SK: `DATE#${string}`;  // DATE#<ISO 8601 timestamp>
  
  // Projected attributes
  readonly userId: string;
  readonly purchaseId: string;
  readonly amount: number;
  readonly status: PurchaseStatus;
  readonly createdAt: string;
}
```

---

## 🔐 API Request/Response Payloads

### **Authentication Endpoints**

#### **POST /auth/signup**

```typescript
interface SignupRequest {
  readonly email: string;          // Valid email format
  readonly password: string;       // Min 8 chars, 1 upper, 1 lower, 1 digit
  readonly username: string;       // 3-20 chars, alphanumeric + underscore
  readonly archetype: PlayerArchetype;
}

interface SignupResponse {
  readonly success: boolean;
  readonly userId: string;
  readonly message: string;
}
```

#### **POST /auth/login**

```typescript
interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

interface LoginResponse {
  readonly accessToken: string;    // JWT, expires in 1 hour
  readonly refreshToken: string;   // Expires in 30 days
  readonly expiresIn: number;      // Seconds until expiry
  readonly userId: string;
  readonly username: string;
  readonly archetype: PlayerArchetype;
}
```

#### **POST /auth/refresh**

```typescript
interface RefreshRequest {
  readonly refreshToken: string;
}

interface RefreshResponse {
  readonly accessToken: string;
  readonly expiresIn: number;
}
```

---

### **Game State Endpoints**

#### **POST /game/save**

```typescript
interface SaveGameRequest {
  readonly userId: string;
  readonly gameState: {
    readonly currentStance: TrigramStance;
    readonly health: number;
    readonly ki: number;
    readonly stamina: number;
    readonly stanceData: readonly StanceProgressData[];
    readonly vitalPointProgress: readonly VitalPointProgressData[];
    readonly equipment: readonly EquipmentData[];
  };
}

interface SaveGameResponse {
  readonly success: boolean;
  readonly gameStateId: string;
  readonly timestamp: string;
  readonly version: number;
}
```

#### **GET /game/load/{userId}**

```typescript
interface LoadGameResponse {
  readonly gameState: GameStateData;
  readonly savedAt: string;
  readonly version: number;
}
```

---

### **Leaderboard Endpoints**

#### **GET /leaderboard/{archetype}**

```typescript
interface LeaderboardRequest {
  readonly archetype: PlayerArchetype | "all";
  readonly limit?: number;       // Default: 100, max: 1000
  readonly offset?: number;      // For pagination
}

interface LeaderboardResponse {
  readonly entries: readonly {
    readonly rank: number;
    readonly userId: string;
    readonly username: string;
    readonly archetype: PlayerArchetype;
    readonly score: number;
    readonly level: number;
  }[];
  readonly total: number;
  readonly nextOffset?: number;
}
```

---

### **Payment Endpoints (Stripe)**

#### **POST /payments/create-checkout**

```typescript
interface CreateCheckoutRequest {
  readonly userId: string;
  readonly items: readonly {
    readonly itemId: string;
    readonly quantity: number;
  }[];
  readonly successUrl: string;   // Redirect after success
  readonly cancelUrl: string;    // Redirect after cancel
}

interface CreateCheckoutResponse {
  readonly sessionId: string;    // Stripe Checkout Session ID
  readonly checkoutUrl: string;  // URL to redirect user
}
```

#### **POST /payments/webhook** (Stripe Webhook)

```typescript
interface StripeWebhookEvent {
  readonly type: string;         // "checkout.session.completed" | "payment_intent.succeeded" | etc.
  readonly data: {
    readonly object: any;        // Stripe event object
  };
}

interface WebhookResponse {
  readonly received: boolean;
}
```

---

## 🔄 Data Migration Strategy

### **Phase 1: Dual Write (Q2 2026)**

**Objective**: Write to both session storage and DynamoDB, validate consistency

```typescript
async function saveGameState(gameState: GameState): Promise<void> {
  // Write to session storage (existing)
  sessionStorage.setItem("gameState", JSON.stringify(gameState));
  
  // Write to DynamoDB (new)
  try {
    await dynamoDB.putItem({
      TableName: "BlackTrigramData",
      Item: {
        PK: `PLAYER#${gameState.userId}`,
        SK: `GAMESTATE#${new Date().toISOString()}`,
        ...gameState,
      },
    });
  } catch (error) {
    console.error("DynamoDB write failed:", error);
    // Continue with session storage only
  }
  
  // Validate consistency (background job)
  await validateDataConsistency(gameState.userId);
}
```

### **Phase 2: DynamoDB Primary (Q3 2026)**

**Objective**: Read from DynamoDB first, fallback to session, migrate on first login

```typescript
async function loadGameState(userId: string): Promise<GameState> {
  // Try DynamoDB first
  try {
    const response = await dynamoDB.query({
      TableName: "BlackTrigramData",
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `PLAYER#${userId}`,
        ":sk": "GAMESTATE#",
      },
      Limit: 1,
      ScanIndexForward: false,  // Most recent first
    });
    
    if (response.Items && response.Items.length > 0) {
      return parseGameState(response.Items[0]);
    }
  } catch (error) {
    console.error("DynamoDB read failed:", error);
  }
  
  // Fallback to session storage
  const sessionData = sessionStorage.getItem("gameState");
  if (sessionData) {
    const gameState = JSON.parse(sessionData);
    
    // Migrate to DynamoDB (background)
    await migrateSessionToDynamoDB(userId, gameState);
    
    return gameState;
  }
  
  // No data found, return default
  return createDefaultGameState(userId);
}
```

### **Phase 3: Cloud Only (Q4 2026)**

**Objective**: Remove session storage dependency, implement offline sync

```typescript
async function syncGameState(userId: string): Promise<void> {
  // Check if online
  if (!navigator.onLine) {
    // Store in IndexedDB for offline play
    await indexedDB.setItem(`gameState_${userId}`, gameState);
    return;
  }
  
  // Sync with DynamoDB
  const localState = await indexedDB.getItem(`gameState_${userId}`);
  const cloudState = await loadGameStateFromDynamoDB(userId);
  
  // Conflict resolution: most recent timestamp wins
  const mergedState = mergeGameStates(localState, cloudState);
  
  await saveGameStateToDynamoDB(userId, mergedState);
  await indexedDB.removeItem(`gameState_${userId}`);
}
```

### **Migration Script Example**

```typescript
/**
 * Migrates game state from session storage to DynamoDB
 */
async function migrateSessionToDynamoDB(
  userId: string,
  sessionGameState: GameState
): Promise<void> {
  const migrationTimestamp = new Date().toISOString();
  
  // Save game state
  await dynamoDB.putItem({
    TableName: "BlackTrigramData",
    Item: {
      PK: `PLAYER#${userId}`,
      SK: `GAMESTATE#${migrationTimestamp}`,
      userId,
      gameStateId: generateUUID(),
      ...sessionGameState,
      timestamp: migrationTimestamp,
      version: 1,
      dataVersion: "1.0.0",
      migrated: true,
      migratedFrom: "session",
    },
  });
  
  // Log migration
  console.log(`Migrated game state for user ${userId}`);
  
  // Mark migration complete
  await markMigrationComplete(userId);
}
```

---

## 🔒 Data Versioning and Backward Compatibility

### **Schema Versioning Strategy**

```typescript
interface DataVersion {
  readonly version: number;        // Incremental version (1, 2, 3...)
  readonly dataVersion: string;    // Semantic version ("1.0.0", "1.1.0")
  readonly schemaChanges: readonly string[];
  readonly migrationRequired: boolean;
}

// Version registry
const DATA_VERSIONS: Record<number, DataVersion> = {
  1: {
    version: 1,
    dataVersion: "1.0.0",
    schemaChanges: ["Initial schema"],
    migrationRequired: false,
  },
  2: {
    version: 2,
    dataVersion: "1.1.0",
    schemaChanges: ["Added bodyPartHealth tracking", "Added muscleActivation"],
    migrationRequired: true,
  },
};
```

### **Migration Handler**

```typescript
async function migrateDataVersion(
  item: any,
  fromVersion: number,
  toVersion: number
): Promise<any> {
  let migratedItem = { ...item };
  
  // Apply migrations sequentially
  for (let v = fromVersion + 1; v <= toVersion; v++) {
    migratedItem = await applyMigration(migratedItem, v);
  }
  
  return migratedItem;
}

async function applyMigration(item: any, toVersion: number): Promise<any> {
  switch (toVersion) {
    case 2:
      // Add bodyPartHealth with default values
      return {
        ...item,
        bodyPartHealth: {
          head: item.health * 0.15,
          torso: item.health * 0.40,
          leftArm: item.health * 0.10,
          rightArm: item.health * 0.10,
          leftLeg: item.health * 0.125,
          rightLeg: item.health * 0.125,
        },
        version: 2,
        dataVersion: "1.1.0",
      };
    
    default:
      return item;
  }
}
```

---

## 🛡️ Security Architecture

### **Encryption at Rest**

- **DynamoDB Encryption**: AWS KMS with customer-managed keys (CMK)
- **Key Rotation**: Automatic annual rotation
- **Algorithm**: AES-256-GCM

```typescript
const tableParams = {
  TableName: "BlackTrigramData",
  SSESpecification: {
    Enabled: true,
    SSEType: "KMS",
    KMSMasterKeyId: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012",
  },
};
```

### **Encryption in Transit**

- **TLS 1.3**: All API communications
- **Certificate Pinning**: Mobile app enforcement
- **HSTS**: HTTP Strict Transport Security enabled

```typescript
const httpsAgent = new https.Agent({
  minVersion: "TLSv1.3",
  ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256",
});
```

### **Access Control (IAM Policies)**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/BlackTrigramData",
      "Condition": {
        "ForAllValues:StringEquals": {
          "dynamodb:LeadingKeys": [
            "PLAYER#${cognito-identity.amazonaws.com:sub}"
          ]
        }
      }
    }
  ]
}
```

### **Audit Logging**

- **DynamoDB Streams**: Capture all data changes
- **CloudTrail**: Log all API calls
- **CloudWatch Logs**: Application-level audit events

```typescript
// DynamoDB Stream handler
export const streamHandler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName === "MODIFY" || record.eventName === "INSERT") {
      await logAuditEvent({
        eventType: record.eventName,
        tableName: record.eventSourceARN.split("/")[1],
        keys: record.dynamodb.Keys,
        userId: record.dynamodb.NewImage.userId.S,
        timestamp: new Date(record.dynamodb.ApproximateCreationDateTime * 1000).toISOString(),
      });
    }
  }
};
```

### **Data Classification**

Per [Hack23 ISMS Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md):

| Data Type | Classification | Encryption | Backup | Retention |
|-----------|---------------|------------|--------|-----------|
| Player Profile | Internal Use | AES-256 | Daily | 7 years |
| Game State | Internal Use | AES-256 | Daily | 1 year |
| Purchases | Confidential | AES-256 | Daily | 10 years (legal) |
| Achievements | Internal Use | AES-256 | Weekly | 1 year |
| Audit Logs | Confidential | AES-256 | Daily | 7 years |

---

## 📊 Cost Optimization

### **DynamoDB Capacity Planning**

```typescript
// Estimated costs (US East 1)
const costEstimate = {
  storage: {
    perGB: 0.25,  // $0.25 per GB-month
    estimatedGB: 10,
    monthlyCost: 2.50,
  },
  readCapacity: {
    perRCU: 0.00013,  // $0.00013 per RCU-hour
    estimatedRCU: 5,
    monthlyCost: 0.47,
  },
  writeCapacity: {
    perWCU: 0.00065,  // $0.00065 per WCU-hour
    estimatedWCU: 2,
    monthlyCost: 0.94,
  },
  total: 3.91,  // $3.91/month for 1,000 users
};
```

### **Single-Table Design Benefits**

- **Reduced Costs**: One table instead of multiple = lower base costs
- **Efficient Queries**: Co-located data for access patterns
- **Lower Latency**: Fewer network hops
- **Simplified Management**: One backup, one alarm, one stream

---

## 🌍 GDPR Compliance

### **Right to Erasure (Article 17)**

```typescript
async function deletePlayerData(userId: string): Promise<void> {
  const items = await queryAllPlayerItems(userId);
  
  // Delete all items in batches
  const batches = chunk(items, 25);  // DynamoDB BatchWriteItem limit
  
  for (const batch of batches) {
    await dynamoDB.batchWriteItem({
      RequestItems: {
        BlackTrigramData: batch.map((item) => ({
          DeleteRequest: {
            Key: {
              PK: item.PK,
              SK: item.SK,
            },
          },
        })),
      },
    });
  }
  
  // Log erasure
  await logAuditEvent({
    eventType: "DATA_DELETION",
    userId,
    timestamp: new Date().toISOString(),
    reason: "GDPR_RIGHT_TO_ERASURE",
  });
}
```

### **Data Portability (Article 20)**

```typescript
async function exportPlayerData(userId: string): Promise<PlayerDataExport> {
  const items = await queryAllPlayerItems(userId);
  
  return {
    profile: items.filter((i) => i.SK === "PROFILE")[0],
    gameStates: items.filter((i) => i.SK.startsWith("GAMESTATE#")),
    achievements: items.filter((i) => i.SK.startsWith("ACHIEVEMENT#")),
    purchases: items.filter((i) => i.SK.startsWith("PURCHASE#")),
    exportedAt: new Date().toISOString(),
    format: "JSON",
    version: "1.0.0",
  };
}
```

---

## 📋 ISMS Framework Alignment

This future data model aligns with:

- **[Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)**: Type safety, immutability, security by design
- **[Data Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)**: Proper data classification and handling
- **[Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md)**: AES-256 encryption, TLS 1.3
- **[Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)**: IAM least privilege
- **[Backup & Recovery Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Backup_Recovery_Policy.md)**: Daily backups, 7-year retention

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram into the Cloud_

This future data model ensures scalable, secure, and GDPR-compliant cloud persistence for Black Trigram's Korean martial arts combat system.

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**📅 Effective Date:** 2026-03-19  
**⏰ Next Review:** 2026-09-19  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
