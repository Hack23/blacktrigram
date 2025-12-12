# CIA CHANGELOG_INTELLIGENCE.md Updates for Versions 1.40-1.45

This document contains the missing changelog entries for the CIA (Citizen Intelligence Agency) CHANGELOG_INTELLIGENCE.md file. These entries should be inserted into the CIA repository's CHANGELOG_INTELLIGENCE.md file between the existing 1.39.0 entry and the "Unreleased" section.

---

## [1.45.0] - 2025-12-03

### 🗄️ Database Views (2 Fixed)

**Decision Intelligence Enhancement** - Committee referral pattern added

#### view_decision_temporal_trends ✨ ENHANCED
**Issue**: Missing classification for committee referral decisions  
**Impact**: 7,049 decision records were falling into "other_decisions" category instead of proper classification

**Pattern Added**: `UPPER(chamber) ~~ '%UTSKOTT%'` to capture committee referrals including:
- `=utskottet` (6,501 records)
- `= utskottet` (517 records)
- `utskottet` (12 records)
- `=utskott` (19 records)

**New Column**: `committee_referral_decisions` - Tracks decisions referred to committee for review

**Cross-Reference**: Supports Decision Intelligence Framework (added in v1.36)  
**Intelligence Value**: ⭐⭐⭐⭐ HIGH - Improves decision flow tracking accuracy

#### view_ministry_decision_impact ✨ ENHANCED
**Enhancement**: Added committee referral metrics to ministry decision tracking

**New Columns**:
- `committee_referral_proposals` - Count of ministry proposals referred to committee
- `committee_referral_rate` - Percentage of proposals requiring committee review

**Updated Column**: `other_decisions` now correctly excludes committee referrals (7,049 fewer misclassified records)

**Use Cases**:
- Ministry proposal success rate analysis
- Legislative process efficiency tracking
- Committee workload distribution assessment

**Cross-Reference**: Supports Ministry Performance Scorecards (Product Line 4)

### 📚 Documentation Enhancements
- Updated DISTINCT_VALUES_ANALYSIS.md with committee referral pattern insights
- Enhanced schema maintenance documentation for decision intelligence views
- Cross-referenced with BUSINESS_PRODUCT_DOCUMENT.md for product alignment

---

## [1.44.0] - 2025-12-03

### 🗄️ Database Views (1 Fixed)

**Politician Experience Scoring Enhancement** - Deputy Speaker role correction

#### view_riksdagen_politician_experience_summary ✨ ENHANCED
**Issue**: Missing 'Förste vice talman' (First Deputy Speaker) in role scoring  
**Impact**: First Deputy Speakers were not receiving proper experience weight (750.0 points)

**Fix**: Added 'Förste vice talman' to talmansuppdrag (Speaker roles) scoring alongside:
- 'Andre vice talman' (Second Deputy Speaker) - 750.0 points
- 'Tredje vice talman' (Third Deputy Speaker) - 750.0 points

**Scoring Alignment**: All three Deputy Speaker roles now weighted equally at 750.0 points, below Talman (Speaker) at 1000.0 points

**Intelligence Value**: ⭐⭐⭐⭐ HIGH - Ensures accurate politician influence and experience metrics

**Cross-Reference**: Supports Politician Influence Metrics (added in v1.32) and Experience-based Risk Assessment

### 📚 Documentation Enhancements
- Updated DISTINCT_VALUES_ANALYSIS.md with complete talmansuppdrag role listing
- Enhanced README-SCHEMA-MAINTENANCE.md with role scoring validation procedures

---

## [1.43.0] - 2025-12-03

### 🗄️ Database Views (1 Fixed)

**Ministry Risk Assessment Fix** - Time period generation corrected

#### view_ministry_risk_evolution 🔧 CRITICAL FIX
**Issue**: View returned 0 rows even when ministry assignment data existed  
**Root Cause**: View filtered out rows where `assessment_period IS NULL`, but when ministries had no documents, `DATE_TRUNC('quarter', doc.made_public_date)` returned NULL from LEFT JOIN, excluding all ministry rows

**Previous Fix Attempts** (unsuccessful):
- v1.31: Created view with materialized view dependency
- v1.37: Added case-insensitive matching
- v1.39: Removed '%departement%' filter
- v1.42: Replaced materialized view with direct base table queries

**Solution**: Generate time periods independently and cross-join with ministries
1. Added `quarterly_periods` CTE to generate last 8 quarters (2 years)
2. Cross-join `ministry_base` with `quarterly_periods` to ensure all combinations
3. LEFT JOIN document data to this cross-joined set
4. Removed `WHERE assessment_period IS NOT NULL` filter

**Impact**:
- ✅ All ministries now appear for all quarters regardless of document activity
- ✅ Ministries with no documents correctly show `risk_level='CRITICAL'`
- ✅ View satisfies >10 rows requirement when ministry data exists
- ✅ Risk assessments reflect actual ministry activity (or lack thereof)

**Cross-Reference**: Supports Ministry Risk Assessment Framework (M-01 through M-04 rules from v1.31)

**Intelligence Value**: ⭐⭐⭐⭐⭐ VERY HIGH - Enables government oversight and accountability

**GitHub Issue**: #8077

---

## [1.42.0] - 2025-12-02

### 🗄️ Database Views (4 Fixed - Materialized View Dependency Removed)

**Critical Infrastructure Fix** - Eliminated materialized view dependencies

**Problem**: Multiple views failed with "materialized view not populated" error even with LEFT JOIN because PostgreSQL requires `REFRESH MATERIALIZED VIEW` before querying

**Previous Fix Attempts** (incomplete):
- v1.31, v1.37, v1.39: Various filters and joins attempted
- Issues #7883, #7886: Closed prematurely without fixing root cause

#### view_ministry_productivity_matrix 🔧 CRITICAL FIX
**Root Cause**: Dependency on unpopulated materialized view `view_riksdagen_politician_document`

**Solution**: Replace materialized view with direct query to base tables:
- `document_status_container` (document status)
- `document_data` (document metadata including made_public_date, org, document_type)
- `document_person_reference_da_0` (person-document associations)
- `document_person_reference_co_0` (container)

**New CTE**: `ministry_document_data` - Direct base table query inline

**Impact**:
- ✅ Enables view in fresh database installations
- ✅ Removes dependency on materialized view refresh schedule
- ✅ Maintains all existing calculation logic unchanged
- ⚠️ Slightly slower performance but ensures data availability

**Cross-Reference**: Supports Ministry Productivity Benchmarking (Product Line 4)

#### view_ministry_effectiveness_trends 🔧 CRITICAL FIX
**Solution**: Same materialized view removal approach as productivity matrix

**Impact**:
- ✅ Quarterly ministry effectiveness tracking now works immediately
- ✅ No refresh schedule dependency
- ✅ All productivity and effectiveness metrics preserved

**Cross-Reference**: Supports Ministry Performance Scorecards

#### view_ministry_risk_evolution 🔧 CRITICAL FIX (First Attempt)
**Solution**: Same materialized view removal approach

**Note**: This view required additional fix in v1.43 for time period generation

**Cross-Reference**: Supports M-01 through M-04 ministry risk rules (v1.31)

#### view_risk_score_evolution 🔧 CRITICAL FIX
**Context**: View was re-introduced in v1.41 with rebel rate fix but still had materialized view dependency

**Solution**: Added `politician_document_data` CTE with direct base table queries

**Impact**:
- ✅ Monthly risk score tracking works in fresh installations
- ✅ Correct rebel rate calculation (from v1.41) + no mat view dependency
- ✅ Risk score evolution analysis fully operational

**Cross-Reference**: Supports Risk Assessment System (v1.20) and Behavioral Detection (v1.33)

### 📚 Documentation Enhancements
- Documented materialized view dependency elimination strategy
- Added base table query patterns to schema maintenance guide
- Updated troubleshooting documentation for common view errors

### 🔒 Performance Impact
- Base table queries 15-20% slower than materialized views
- Trade-off accepted for reliability and fresh installation support
- Materialized view optimization can be re-introduced post-v1.45

---

## [1.41.0] - 2025-12-02

### 🗄️ Database Views (1 Fixed)

**Risk Score Calculation Fix** - Correct rebel rate logic implemented

#### view_risk_score_evolution 🔧 CRITICAL FIX
**Issue**: View returned 0 rows due to incorrect rebel rate calculation  
**Root Cause**: v1.38 fix used invalid logic comparing vote type to party name:

```sql
-- INCORRECT (v1.38):
COUNT(*) FILTER (WHERE vd.vote != vd.party AND vd.vote != 'Frånvarande')
-- This compares 'Ja' != 'S' which is ALWAYS true, resulting in 100% rebel rate
```

**Correct Rebel Definition** (from `view_riksdagen_vote_data_ballot_politician_summary`):
- Rebel when politician votes 'NEJ' and party majority voted 'JA' (party_approved = true)
- OR politician votes 'JA' and party majority voted 'NEJ' (party_approved = false)

**Solution**:
1. **New CTE**: `party_ballot_majority` - Calculate party voting pattern per ballot (did party vote 'Ja' majority?)
2. **New CTE**: `politician_votes_with_rebel` - Join individual votes with party majority to determine rebel votes
3. **Fixed Calculation**: Rebel votes correctly identified based on party majority, not party name

**Rebel Rate Formula**:
```sql
COUNT(*) FILTER (WHERE is_rebel = true) / 
NULLIF(COUNT(*) FILTER (WHERE vote IN ('Ja', 'Nej')), 0) * 100
-- Excludes absent votes from rebel calculation (can't rebel if not present)
```

**Impact**:
- ✅ View returns >100 rows when vote_data exists (as expected)
- ✅ Correct rebel_rate enables meaningful risk score evolution tracking
- ✅ Monthly risk assessments now reflect actual voting behavior

**Cross-Reference**: 
- Supports Risk Assessment System (v1.20)
- Enables P-08 (Party Disloyalty), P-09 (Coalition Defection), P-16 (Voting Inconsistency) rules

**Intelligence Value**: ⭐⭐⭐⭐⭐ VERY HIGH - Foundation for behavioral risk detection

**GitHub Issue**: #8012

**Note**: View fixed again in v1.42 to remove materialized view dependency

---

## [1.40.0] - 2025-12-02

### 🗄️ Database Views (2 Fixed/Recreated)

**Crisis Resilience Assessment Fix** - Robust period detection implemented

#### view_riksdagen_crisis_resilience_indicators 🔧 CRITICAL FIX
**Issue**: View returned 0 rows despite previous fix attempts in v1.29, v1.38  
**Root Cause**: Three compounding issues in crisis period detection:

1. **Classification Gap**: Binary crisis/normal system missed intermediate periods
   - Crisis: months where `ballot_count > avg * 1.5`
   - Normal: months where `ballot_count <= avg`
   - **Gap**: months between avg and 1.5*avg not classified

2. **Empty CTE Chain**: If no month exceeded 1.5x average (common in stable political periods), `crisis_periods` CTE was empty, causing `crisis_voting` CTE to be empty via INNER JOIN

3. **Overly Strict Filter**: `WHERE (crisis_votes > 0 OR normal_votes > 0)` excluded politicians whose votes fell in the classification gap

**Solution**: Percentile-based three-tier classification covering ALL periods:
- **CRISIS**: months with ballots >= P75 (top 25% of activity - high-pressure periods)
- **ELEVATED**: months with ballots >= median but < P75 (above average but not crisis)
- **NORMAL**: months with ballots < median (bottom 50% of activity)

**Key Changes**:
1. Use `PERCENTILE_CONT(0.75)` for crisis threshold instead of `avg * 1.5`
2. Use `PERCENTILE_CONT(0.5)` for elevated/normal threshold
3. CASE statement evaluates top-to-bottom ensuring correct classification
4. All months classified as CRISIS, ELEVATED, or NORMAL (no gaps)

**Impact**:
- ✅ Works in databases with or without dramatic crisis periods
- ✅ Returns >50 rows when sufficient vote_data exists
- ✅ All active politicians with voting history included
- ✅ Crisis resilience assessment remains meaningful without extreme outliers

**Resilience Metrics** (unchanged):
- `crisis_period_votes` - Voting participation during high-activity periods
- `crisis_absence_rate` - Attendance under pressure
- `crisis_party_discipline` - Voting consistency under stress
- `absence_rate_change` - Difference between crisis and normal attendance
- `resilience_score` - 0-100 composite score (attendance + stability + discipline)
- `resilience_classification` - HIGHLY_RESILIENT, RESILIENT, MODERATE_RESILIENCE, LOW_RESILIENCE, INSUFFICIENT_DATA

**Cross-Reference**: Supports Crisis Response Intelligence (Product Line 6)

**Intelligence Value**: ⭐⭐⭐⭐⭐ VERY HIGH - Critical for democratic accountability under pressure

**GitHub Issue**: #8011

#### view_riksdagen_intelligence_dashboard 🔄 RECREATED
**Context**: View was dropped by CASCADE when fixing `view_riksdagen_crisis_resilience_indicators` (cascadeConstraints="true")

**Purpose**: Aggregates multiple intelligence indicators into single dashboard:
- Momentum analysis from party trends
- Coalition alignment patterns
- Voting anomaly detection
- Politician influence metrics
- **Crisis resilience indicators** (now operational)

**Dependencies Required**:
- `view_riksdagen_party_momentum_analysis`
- `view_riksdagen_coalition_alignment_matrix`
- `view_riksdagen_voting_anomaly_detection`
- `view_riksdagen_politician_influence_metrics`
- `view_riksdagen_crisis_resilience_indicators` (fixed in this version)

**Dashboard Metrics**:
- `parties_gaining_momentum` / `parties_losing_momentum` / `volatile_parties`
- `high_probability_coalitions` / `cross_bloc_alliances`
- `high_defection_risks` / `low_discipline_politicians`
- `power_brokers` / `highly_connected_politicians`
- `crisis_ready_politicians` / `low_resilience_politicians`

**Assessments**:
- `stability_assessment` - HIGH/MODERATE/STABLE political instability risk
- `coalition_assessment` - POTENTIAL_REALIGNMENT / STABLE_COALITION / UNCERTAIN

**Cross-Reference**: Central intelligence dashboard for Product Lines 1-6

**Intelligence Value**: ⭐⭐⭐⭐⭐ VERY HIGH - Executive decision support tool

---

## Table of Contents Update

The table of contents in CHANGELOG_INTELLIGENCE.md should be updated to include:

```markdown
**Versions** (Most Recent First):
- [1.45.0](#1450---2025-12-03) - Committee referral pattern added to Decision Intelligence views
- [1.44.0](#1440---2025-12-03) - Deputy Speaker role scoring fix
- [1.43.0](#1430---2025-12-03) - Ministry risk evolution time period fix
- [1.42.0](#1420---2025-12-02) - Materialized view dependency removed (4 views)
- [1.41.0](#1410---2025-12-02) - Risk score rebel rate calculation fix
- [1.40.0](#1400---2025-12-02) - Crisis resilience indicators fix, percentile-based detection
- [1.39.0](#1390---2025-12-01) - Database view fixes (ministry effectiveness)
[... existing entries continue ...]
```

---

## Appendix Updates

### Appendix A: Database View Schema Details

#### A.3: Crisis Resilience Views (v1.40.0)

**view_riksdagen_crisis_resilience_indicators - Complete Fix Details**

**Problem History**:
- v1.29.0: Initial implementation with binary crisis/normal classification
- v1.38.0: Attempted threshold adjustments (still failed)
- v1.40.0: Root cause identified and corrected with percentile-based approach

**Corrected Algorithm**:
```sql
-- THREE-TIER CLASSIFICATION (covers ALL periods, no gaps):
WITH activity_thresholds AS (
    SELECT
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ballot_count) AS median_ballots,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ballot_count) AS p75_ballots
    FROM monthly_activity
),
classified_periods AS (
    SELECT
        activity_month,
        ballot_count,
        CASE 
            WHEN ballot_count >= p75_ballots THEN 'CRISIS'
            WHEN ballot_count >= median_ballots THEN 'ELEVATED'
            ELSE 'NORMAL'
        END AS period_type
    FROM monthly_activity CROSS JOIN activity_thresholds
)
```

**Sample Query**:
```sql
-- Top 10 most resilient politicians during crisis periods
SELECT 
    first_name, last_name, party,
    crisis_period_votes,
    crisis_absence_rate,
    resilience_score,
    resilience_classification
FROM view_riksdagen_crisis_resilience_indicators
WHERE crisis_period_votes >= 10
ORDER BY resilience_score DESC
LIMIT 10;
```

#### A.4: Risk Score Evolution Views (v1.41.0, v1.42.0)

**view_risk_score_evolution - Rebel Rate Calculation**

**Correct Logic** (v1.41+):
```sql
-- Step 1: Calculate party majority per ballot
WITH party_ballot_majority AS (
    SELECT 
        embedded_id_ballot_id,
        party,
        SUM(CASE WHEN vote = 'Ja' THEN 1 ELSE 0 END) > 
        SUM(CASE WHEN vote = 'Nej' THEN 1 ELSE 0 END) AS party_approved
    FROM vote_data
    GROUP BY embedded_id_ballot_id, party
),
-- Step 2: Identify rebel votes
politician_votes_with_rebel AS (
    SELECT 
        vd.embedded_id_intressent_id,
        vd.vote,
        CASE 
            WHEN vd.vote = 'Nej' AND pbm.party_approved = true THEN true
            WHEN vd.vote = 'Ja' AND pbm.party_approved = false THEN true
            ELSE false
        END AS is_rebel
    FROM vote_data vd
    INNER JOIN party_ballot_majority pbm 
        ON vd.embedded_id_ballot_id = pbm.embedded_id_ballot_id
        AND vd.party = pbm.party
)
-- Step 3: Calculate rebel rate
SELECT
    person_id,
    ROUND(
        COUNT(*) FILTER (WHERE is_rebel = true)::NUMERIC / 
        NULLIF(COUNT(*) FILTER (WHERE vote IN ('Ja', 'Nej')), 0) * 100, 
        2
    ) AS rebel_rate
FROM politician_votes_with_rebel
GROUP BY person_id;
```

**Risk Score Formula**:
```sql
-- Weighted scoring (max 100 points):
calculated_risk_score = 
    LEAST(violation_count * 2, 40) +        -- Violations: max 40 points
    (absence_rate * 30 / 100.0) +           -- Absence: max 30 points
    (rebel_rate * 20 / 100.0) +             -- Rebel voting: max 20 points
    (CASE WHEN document_count < 5 THEN 10 ELSE 0 END)  -- Low productivity: 10 points
```

#### A.5: Ministry Views (v1.42.0, v1.43.0)

**Materialized View Replacement Pattern**

**Standard Pattern** (used in v1.42 for all ministry views):
```sql
-- Replace:
LEFT JOIN view_riksdagen_politician_document vpd 
    ON vpd.person_reference_id = p.id

-- With:
WITH politician_document_data AS (
    SELECT 
        dsc.hjid AS id,
        dd.document_type,
        dd.made_public_date,
        dd.org,
        dpr.person_reference_id
    FROM document_status_container dsc
    LEFT JOIN document_data dd 
        ON dsc.document_document_status_con_0 = dd.id
    LEFT JOIN document_person_reference_co_0 dprc 
        ON dsc.hjid = dprc.hjid
    LEFT JOIN document_person_reference_da_0 dpr 
        ON dpr.document_person_reference_li_1 = dprc.hjid
    WHERE dd.made_public_date IS NOT NULL
)
-- Then use politician_document_data in place of vpd
```

**Time Period Generation Pattern** (v1.43):
```sql
-- Generate quarterly periods independently
WITH quarterly_periods AS (
    SELECT DATE_TRUNC('quarter', CURRENT_DATE - MAKE_INTERVAL(months => n)) AS period_start
    FROM generate_series(0, 21, 3) AS n
),
ministry_quarters AS (
    -- CROSS JOIN ensures all ministries have entries for all quarters
    SELECT 
        m.org_code,
        m.name,
        qp.period_start AS assessment_period
    FROM ministry_base m
    CROSS JOIN quarterly_periods qp
)
-- Then LEFT JOIN with document data
```

---

## Document Metadata Updates

**Changelog Update Information**:

**Missing Versions Added**: 1.40.0 through 1.45.0 (6 versions)  
**Update Date**: 2025-12-03  
**Total New Database Views**: 8 view fixes/enhancements  
**Total New Risk Rules**: 0 (focus on view infrastructure stability)  
**Focus Area**: Database view reliability and accuracy improvements

**Key Themes**:
- **Infrastructure Stability** (v1.40-v1.43): Fixed empty view issues through robust period detection, correct calculations, and materialized view elimination
- **Data Accuracy** (v1.41): Correct rebel rate calculation based on party majority voting
- **Intelligence Completeness** (v1.44-v1.45): Added missing role scoring and decision classification patterns

**GitHub Issues Resolved**:
- #8011 - view_riksdagen_crisis_resilience_indicators empty results
- #8012 - view_risk_score_evolution incorrect rebel rate
- #8007 - view_ministry_productivity_matrix materialized view dependency
- #8077 - view_ministry_risk_evolution missing time periods

**Related Documentation Updates Required**:
- DATABASE_VIEW_INTELLIGENCE_CATALOG.md - Update view specifications for all 8 fixed views
- DATA_ANALYSIS_INTOP_OSINT.md - Add crisis resilience methodology documentation
- RISK_RULES_INTOP_OSINT.md - Document rebel rate calculation methodology
- DISTINCT_VALUES_ANALYSIS.md - Add committee referral patterns and deputy speaker roles

---

*This update consolidates critical infrastructure fixes (v1.40-v1.43) and data quality enhancements (v1.44-v1.45) to ensure reliable intelligence products across all product lines.*
