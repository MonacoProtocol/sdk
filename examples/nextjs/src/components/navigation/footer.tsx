import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <a href="https://www.monacoprotocol.xyz/" target="_blank" rel="noopener noreferrer">
        Website
      </a>
      <a href="https://docs.monacoprotocol.xyz/" target="_blank" rel="noopener noreferrer">
        Documentation
      </a>
      <a href="https://github.com/MonacoProtocol" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <a
        href="https://github.com/MonacoProtocol/sdk/discussions"
        target="_blank"
        rel="noopener noreferrer"
      >
        DevHub
      </a>
      <a href="https://discord.gg/8mR7bbBMP6" target="_blank" rel="noopener noreferrer">
        Discord
      </a>
    </footer>
  );
}

export default Footer;
