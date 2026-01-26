# Quick Reference: Technique Variety Test Suite

## 📁 Main Test File
```
src/systems/trigram/__tests__/TechniqueVariety.test.ts
```

## 🚀 Quick Commands

```bash
# Run the test
npm test -- src/systems/trigram/__tests__/TechniqueVariety.test.ts

# Run with verbose output
npm test -- src/systems/trigram/__tests__/TechniqueVariety.test.ts -- --reporter=verbose
```

## 📊 What It Tests

✅ **AC1**: 3-5 techniques per stance (51 total ✓)
✅ **AC2**: Distinct properties (damage, stamina, speed, range)
✅ **AC3**: Bilingual names (100% coverage ✓)
✅ **AC4**: Categorization (light/medium/heavy/special)
⚠️ **AC5**: Special techniques per stance
⚠️ **AC6**: Balance (<60% per category)
✅ **AC7**: Animation hooks (100% coverage ✓)

## 📈 Current Status

- **Total Tests**: 31
- **Passed**: 26 ✅
- **Failed**: 5 ⚠️ (expected - identifies issues to fix)

## 🔍 Known Issues (To Fix)

1. TAE stance: needs medium/long range
2. `geon_heavenly_fist`: adjust properties
3. `geon_axe_kick`: adjust execution time
4. Add special techniques to some stances
5. Balance range distribution (too many short)

## 📖 Documentation

- **TEST_RESULTS_SUMMARY.md**: Detailed results
- **VERIFICATION.md**: Test structure guide
- **TASK_COMPLETE.md**: Full summary
- **src/systems/trigram/__tests__/README.md**: Test patterns

## 💡 Key Features

- 31 comprehensive tests
- Helper functions for analysis
- Detailed console logging
- Integration with KoreanTechniquesSystem
- Type-safe TypeScript
- Bilingual (Korean/English)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
