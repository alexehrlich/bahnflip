import "./Header.css";

interface Props {
  onAboutClick: () => void;
  onLabClick: () => void;
}

export function Header({ onAboutClick, onLabClick }: Props) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <img src="/logo.png" alt="bahnflip logo" className="site-header__logo-img" />
        <div className="site-header__text">
          <span className="site-header__logo">bahnflip</span>
          <span className="site-header__tagline">
            Pick a station — flip to see if the last train was on time.
          </span>
        </div>
      </div>
      <nav className="site-header__nav">
        <button className="site-header__about" onClick={onLabClick}>
          Lab
        </button>
        <button className="site-header__about" onClick={onAboutClick}>
          About
        </button>
      </nav>
    </header>
  );
}
