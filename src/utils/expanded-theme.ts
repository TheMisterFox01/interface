import '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    custom?: any;
  }
  interface PaletteOptions {
    custom?: any;
  }
}
