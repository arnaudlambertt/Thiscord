/** @jsx jsx */
import { jsx } from '@emotion/core'

const styles = {
  footer: {
    height: '30px',
    backgroundColor: 'rgba(255,255,255,.3)',
    flexShrink: 0,
  }
}

export const Footer = () => {
    return (
      <footer className="App-footer" style={styles.footer}>
      <p1>Footer</p1>
    </footer>
  );
}
