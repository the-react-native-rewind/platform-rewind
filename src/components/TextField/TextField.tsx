import React from "react";
import classNames from "classnames";

export type TextFieldVariant = "default" | "outlined" | "solid";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  withButton?: boolean;
  buttonLabel?: string;
  /**
   * `default` is the pre-redesign field. `outlined` is the hand-inked look:
   * a 3px rule in the ink colour over the card surface, with a DM Mono
   * placeholder — a box drawn on the page rather than a chrome input.
   *
   * `solid` is the same field for a dark surface it does not own. The inked
   * rule only works over paper: on the subscribe block's backdrop it is a
   * dark line on a dark ground, invisible, and all it does is take 3px off
   * the inside of the box. This drops the rule and lets the fill do the
   * work, which is what makes it read against the code behind it.
   */
  variant?: TextFieldVariant;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  withButton = false,
  buttonLabel = "Subscribe",
  variant = "default",
  className = "",
  ...props
}) => {
  if (variant === "solid") {
    return (
      <input
        type="email"
        placeholder={placeholder}
        className={classNames(
          "w-full rounded-[10px] border-0 px-[18px] py-[17px] font-dm-mono text-[15px] transition-shadow focus:outline-none",
          "bg-input-paper-light text-ink-light placeholder:text-ink-faint-light",
          // The focus ring replaces the border it no longer has, and is the
          // marker colour so it reads against the backdrop.
          "focus-visible:ring-2 focus-visible:ring-mark-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          className,
        )}
        {...props}
      />
    );
  }

  if (variant === "outlined") {
    return (
      <input
        type="email"
        placeholder={placeholder}
        className={classNames(
          "w-full rounded-[10px] border-[3px] px-[18px] py-[15px] font-dm-mono text-[15px] transition-colors focus:outline-none",
          "border-rule-strong-light bg-input-paper-light text-ink-light placeholder:text-ink-faint-light focus-visible:border-mark-light",
          "dark:border-rule-strong-dark dark:bg-input-paper-dark dark:text-ink-dark dark:placeholder:text-ink-faint-dark dark:focus-visible:border-mark-dark",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={`flex w-full items-center rounded-xl border overflow-hidden border-input-border dark:border-border-dark ${className}`}
    >
      <input
        type="email"
        placeholder={placeholder}
        className="font-dm-sans h-16 px-4 py-2 text-lg border-none flex-grow focus:outline-none bg-input-background text-text-primary-light placeholder:text-text-muted-light dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark"
        {...props}
      />
      {withButton && (
        <button className="font-dm-sans h-12 px-6 bg-primary text-white font-semibold focus:outline-none">
          {buttonLabel}
        </button>
      )}
    </div>
  );
};
