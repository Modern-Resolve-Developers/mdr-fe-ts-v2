import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { useEffect } from "react";
type Props = {
  result: any;
};
export const PasswordStrengthMeter = (props: Props) => {
  const { result } = props;
  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };
  zxcvbnOptions.setOptions(options);
  const createPasswordLabel = (result: any) => {
    switch (result.score) {
      case 0:
        return "Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Weak";
    }
  };

  return (
    <>
      <div className="password-strength-meter">
        <progress
          className={`password-strength-meter-progress strength-${createPasswordLabel(
            result
          )}`}
          value={result.score}
          max="4"
        />
        <br />
        <label className="password-strength-meter-label">
          <strong>Password strength:</strong> {createPasswordLabel(result)}
        </label>
      </div>
    </>
  );
};
