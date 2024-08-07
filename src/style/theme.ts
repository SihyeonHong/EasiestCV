export type ColorKey = "primary" | "background" | "border" | "text" | "warning";

interface Theme {
  color: Record<ColorKey, string>;
  borderRadius: {
    default: string;
  };
}

export const theme: Theme = {
  color: {
    primary: "#8d7824",
    background: "#f9f9f9",
    border: "rgba(0, 0, 0, 0.1)",
    text: "#333",
    warning: "red",
  },
  borderRadius: {
    default: "5px",
  },
};
