import { useRef, useEffect, type ChangeEvent } from "react";

type Props = {
  length: number;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
};

export const OtpBox: React.FC<Props> = ({ length = 4, otp, setOtp }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOnChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // MOVE TO NEXT INPUT
    if (value && index < length - 1 && inputRefs.current?.[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current?.[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);

    // optional;
    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.indexOf("");
      if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRefs.current?.[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  return (
    <div className="flex gap-3 justify-center p-2 md:p-8">
      {otp.map((value, index) => (
        <input
          type="password"
          key={index}
          autoComplete="one-time-code"
          value={value}
          className="border w-10 h-10 md:w-16 md:h-16 text-center"
          ref={(input) => {
            inputRefs.current[index] = input;
          }}
          onChange={(e) => handleOnChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};
