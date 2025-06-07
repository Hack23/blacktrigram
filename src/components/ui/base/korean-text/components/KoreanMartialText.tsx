import React from "react";
import type { KoreanMartialTextProps } from "../../../../../types"; // Use types from main types
// import { KOREAN_MARTIAL_TEXT_STYLES, KOREAN_HONORIFICS } from "../constants"; // KOREAN_HONORIFICS not exported
import { KoreanText } from "./KoreanText"; // Assuming this is the React DOM component

export const KoreanMartialText: React.FC<KoreanMartialTextProps> = ({
  korean,
  english,
  martialVariant,
  honorLevel,
  showHonorific = false,
  rank, // Can be used if different from honorLevel
  ...props
}) => {
  let textToDisplay = typeof korean === "string" ? korean : korean.korean;
  const englishToDisplay =
    typeof korean === "string" ? english : korean.english || english;

  // const styleKey = martialVariant || "default";
  // const baseStyle = KOREAN_MARTIAL_TEXT_STYLES[styleKey] || KOREAN_MARTIAL_TEXT_STYLES.default;

  // let honorificText = "";
  // if (showHonorific && honorLevel) {
  //   honorificText = KOREAN_HONORIFICS[honorLevel] || "";
  //   if (honorificText) {
  //     textToDisplay = `${textToDisplay} ${honorificText}`;
  //   }
  // }
  // if (showHonorific && rank && !honorLevel) { // Fallback to rank if honorLevel not provided
  //    honorificText = KOREAN_HONORIFICS[rank] || "";
  //    if (honorificText) {
  //      textToDisplay = `${textToDisplay} ${honorificText}`;
  //    }
  // }

  return (
    <KoreanText
      korean={textToDisplay}
      english={englishToDisplay || undefined}
      // style={baseStyle} // Apply styles via props or CSS classes
      variant="martial" // Pass variant for styling
      {...props}
    >
      {/* Additional elements like rank icons can be added here */}
    </KoreanText>
  );
};
