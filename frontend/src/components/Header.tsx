import "./Header.css";

interface Props {
  onAboutClick: () => void;
}

export function Header({ onAboutClick }: Props) {
  return (
    <header className="site-header">
      <span className="site-header__logo">bahnflip</span>
      <button className="site-header__about" onClick={onAboutClick}>
        About
      </button>
    </header>
  );
}
