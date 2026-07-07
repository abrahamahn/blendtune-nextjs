// main/apps/web/src/client/features/layout/header/index.tsx
/**
 * Main header: wordmark, search, and auth state. Responsive — desktop bar on
 * wide viewports, fixed top bar + menu sheet on mobile. Genres are not here;
 * they live in the catalog's genre tabs.
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import { Button, Heading, Skeleton } from '@ui';
import { Link } from '@router/index';
import { useSession } from '@features/auth/services/useSession';
import SearchBar from '@features/sounds/search/components/SearchBar';
import SearchBarMobile from '@features/sounds/search/components/SearchBarMobile';
import AuthModal from '@features/auth';
import useAuthModal from '@features/auth/hooks/useAuthModal';
import useAuth from '@features/auth/hooks/useAuth';
import useMobileSearch from '@features/sounds/search/hooks/useMobileSearch';
import { useKeywords } from '@features/tracks/keywords/hooks/useKeywords';
import { useMobileMenu } from '@features/layout/header/hooks/useMobileMenu';
import Logo from '@components/common/Logo';

import './header.css';

const Header: React.FC = () => {
  const { userAuthenticated, sessionLoading } = useSession();
  const { authModalOpen, form, openSignInModal, openSignUpModal, closeAuthModal, setForm } =
    useAuthModal();
  const { logout } = useAuth();
  const { isMobileSearch, isAnimating, toggleSearchBar } = useMobileSearch();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, handleSoundsClick } = useMobileMenu();
  const { keywords } = useKeywords();

  const authButtons = userAuthenticated ? (
    <>
      <Button as={Link} variant="text" size="small" {...{ to: '/welcome' }}>
        <FontAwesomeIcon icon={faUser} /> Profile
      </Button>
      <Button variant="secondary" size="small" onClick={logout}>
        Log out
      </Button>
    </>
  ) : (
    <>
      <Button variant="text" size="small" onClick={openSignInModal}>
        <FontAwesomeIcon icon={faUser} /> Log in
      </Button>
      <Button variant="primary" size="small" onClick={openSignUpModal}>
        Get started
      </Button>
    </>
  );

  return (
    <header className="bt-header">
      {/* Desktop bar */}
      <nav className="bt-header-desktop">
        <div className="bt-header-cluster">
          <Logo />
          <SearchBar keywords={keywords} />
        </div>
        <div className="bt-header-auth">
          {sessionLoading ? (
            <>
              <Skeleton width="5rem" height="2rem" />
              <Skeleton width="6rem" height="2rem" />
            </>
          ) : (
            authButtons
          )}
        </div>
      </nav>

      {/* Mobile bar */}
      <nav className="bt-header-mobile">
        <div className="bt-header-mobile-cluster">
          <Button
            variant="text"
            size="inline"
            className="bt-header-icon-btn"
            onClick={openMobileMenu}
            data-testid="mobile-menu-button"
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </Button>
          <Logo />
        </div>
        <div className="bt-header-mobile-cluster">
          <Button
            variant="text"
            size="inline"
            className="bt-header-icon-btn"
            onClick={toggleSearchBar}
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          {sessionLoading ? (
            <Skeleton width="1.5rem" height="1.5rem" />
          ) : (
            <Button
              variant="text"
              size="inline"
              className="bt-header-icon-btn"
              onClick={openSignInModal}
              data-testid="mobile-menu-signin"
              aria-label="Log in"
            >
              <FontAwesomeIcon icon={faUser} />
            </Button>
          )}
        </div>
      </nav>

      {isMobileSearch && (
        <SearchBarMobile
          keywords={keywords}
          isAnimating={isAnimating}
          toggleSearchBar={toggleSearchBar}
        />
      )}

      {isMobileMenuOpen && (
        <nav aria-label="Mobile menu">
          <div className="bt-header-scrim" onClick={closeMobileMenu} />
          <div className="bt-header-sheet">
            <div className="bt-header-sheet-top">
              <Heading as="h2" size="md">
                Menu
              </Heading>
              <Button
                variant="text"
                size="inline"
                className="bt-header-icon-btn"
                onClick={closeMobileMenu}
                data-testid="mobile-menu-close"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </Button>
            </div>
            <div className="bt-header-sheet-actions">
              {userAuthenticated ? (
                <>
                  <Button variant="secondary" data-testid="mobile-menu-profile">
                    Profile
                  </Button>
                  <Button variant="primary" onClick={logout} data-testid="mobile-menu-signup">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={openSignInModal}
                    data-testid="mobile-menu-signin"
                  >
                    Log in
                  </Button>
                  <Button variant="primary" onClick={openSignUpModal} data-testid="mobile-menu-signup">
                    Get started
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="text"
              size="inline"
              className="bt-header-sheet-link"
              onClick={() => handleSoundsClick()}
            >
              <FontAwesomeIcon icon={faMusic} /> Sounds
            </Button>
          </div>
        </nav>
      )}

      {authModalOpen && <AuthModal closeAuthModal={closeAuthModal} form={form} setForm={setForm} />}
    </header>
  );
};

export default Header;
