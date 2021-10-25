
/** @jsxImportSource @emotion/react */

const styles = {
  header: {
    height: '60px',
    backgroundColor: 'rgba(255,255,255,.3)',
    flexShrink: 0,
  },
  headerLogIn: {
    backgroundColor: 'red',
  },
  headerLogOut: {
    backgroundColor: 'blue',
  },
}

export default function Header() {
  return (
    <header css={styles.header}>
      Header
    </header>
  );
}
