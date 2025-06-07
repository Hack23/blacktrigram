import React from "react";
import type { KoreanTechniqueTextProps } from "../../../../../types";
import { KoreanText } from "./KoreanText"; // Use the React DOM KoreanText component
import { TRIGRAM_SYMBOL_DATA } from "../constants"; // Import from local constants

export const KoreanTechniqueText: React.FC<KoreanTechniqueTextProps> = ({
  korean,
  english,
  koreanName: propKoreanName, // Use prop names
  englishName: propEnglishName,
  trigram,
  showStanceSymbol = false,
  damage,
  mastered = false,
  ...props
}) => {
  const baseKorean = typeof korean === "string" ? korean : korean.korean;
  const baseEnglish =
    typeof korean === "string" ? english : korean.english || english;

  const techniqueKoreanName = propKoreanName || baseKorean;
  const techniqueEnglishName = propEnglishName || baseEnglish || "";

  let displayText = techniqueKoreanName;
  if (showStanceSymbol && trigram && TRIGRAM_SYMBOL_DATA[trigram]) {
    displayText = `${TRIGRAM_SYMBOL_DATA[trigram]} ${displayText}`;
  }
  if (damage) {
    displayText = `${displayText} (${damage})`;
  }
  if (mastered) {
    displayText = `★ ${displayText}`;
  }

  return (
    <KoreanText // Use the React DOM KoreanText component
      korean={displayText}
      english={techniqueEnglishName}
      variant="technique"
      // style={KOREAN_TECHNIQUE_TEXT_STYLES.default} // Apply styles via props or CSS
      {...props}
    />
  );
};
