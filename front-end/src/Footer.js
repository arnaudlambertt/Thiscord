
/** @jsxImportSource @emotion/react */
import { useTheme } from '@mui/styles';
const useStyles = (theme) => ({
  footer: {
    backgroundColor: theme.palette.background.default,
    color:theme.palette.text.primary,
    borderTop:"rgba(0, 0, 0, 0.23)",
    borderTopStyle:"solid",
    borderTopWidth:1,
  },

})

export default function Footer() {
    const styles = useStyles(useTheme())
  return (
    <footer style={styles.footer}>
  <p style={{textAlign: "center",margin:"auto",padding:4}}> Made with ❤️ by Arnaud and Clément </p>
    </footer>
  );
}
