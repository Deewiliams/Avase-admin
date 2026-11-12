import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "dark",
  primaryShade: 8,

  colors: {
    dark: [
      "#E9ECEF",
      "#CED4DA",
      "#ADB5BD",
      "#868E96",
      "#495057",
      "#343A40",
      "#263640",
      "#202E36",
      "#18242C",
      "#111A20",
    ],
    gold: [
      "#F9F5ED",
      "#F0E6D3",
      "#E6D7BA",
      "#DCC79F",
      "#D0B581",
      "#B18C52",
      "#9B7945",
      "#82663A",
      "#695230",
      "#514025",
    ],
  },

  fontFamily: "Inter, sans-serif",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },

  defaultRadius: "md",

  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
      },
    },
  },
});
