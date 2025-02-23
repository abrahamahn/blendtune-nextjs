import React from "react";
import Link from "next/link";
import { useSession } from "@auth/services/useSession";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faArrowRight,
  faMusic,
  faGreaterThan,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import SearchBar from "@search/components/SearchBar";
import SearchBarMobile from "@search/components/SearchBarMobile";

import AuthModal from "@features/auth";
import useAuthModal from "@auth/hooks/useAuthModal";
import useAuth from "@auth/hooks/useAuth";
import useGenreMenu from "@header/hooks/useGenreMenu";
import useMobileSearch from "@search/hooks/useMobileSearch";
import useKeywords from "@tracks/hooks/useKeywords";

import { useMobileMenu } from "@header/hooks/useMobileMenu";


import Logo from "@components/common//Logo";

const Header: React.FC = () => {;
  const { userAuthenticated } = useSession();

  /* Desktop Functionality */
  // Auth Modal
  const {
    authModalOpen,
    form,
    openSignInModal,
    openSignUpModal,
    closeAuthModal,
    setForm,
  } = useAuthModal();

  const { logout } = useAuth();

  /* Mobile Functionality */
  const { isMobileSearch, isAnimating, toggleSearchBar }
 = useMobileSearch();
 const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, handleSoundsClick } = useMobileMenu();

  /* Genre Menu */
  const { genreItems, handleGenreItemClick } = useGenreMenu();

  /* Fetch All Available Keywords */
  const { keywords } = useKeywords();

  /*  useEffect(() => {
    checkSession();
    if (userProfileCreated === false) {
      router.push("/welcome");
    }
  }, [router, userProfileCreated, checkSession]);
*/
  return (
    <header className="w-full h-full">
      <div>
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center justify-between 
                      w-full h-full 
                      xl:px-2 xl:py-4 lg:px-2 py-2">
          <div className="flex items-center justify-between mx-auto w-full px-6">
            <div className="flex items-center space-x-2 lg:space-x-4 h-full">
              <Logo />
              {/* Search Bar */}
              <SearchBar keywords={keywords} />
            </div>
            <div className="flex items-center space-x-2 lg:space-x-2">
              {userAuthenticated ? (
                <Link
                  href="/welcome"
                  className="font-medium flex flex-row items-center text-sm text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-200 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700 py-1.5 px-4 rounded-full"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-0 xl:mr-2 text-black dark:text-neutral-200"
                  />
                  <p className="hidden xl:block">Profile</p>
                </Link>
              ) : (
                <button
                  onClick={openSignInModal}
                  className="font-medium flex flex-row items-center text-sm text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-200 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700 py-1.5 px-4 rounded-full"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-0 xl:mr-2 text-black dark:text-neutral-200"
                  />
                  <p className="hidden xl:block">Log In</p>
                </button>
              )}
              {userAuthenticated ? (
                <button
                  onClick={logout}
                  className="font-medium flex flex-row text-sm items-center border-2 border-transparent dark:border-white text-neutral-200 dark:text-white dark:hover:text-neutral-200/50 bg-neutral-900 dark:bg-transparent  dark:hover:bg-neutral-700 py-1.5 px-4 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faGreaterThan}
                    size="xs"
                    className="hidden md:block mr-0 xl:mr-2 text-neutral-200 dark:text-white"
                  />
                  <p className="hidden xl:block">Log Out</p>
                </button>
              ) : (
                <button
                  onClick={openSignUpModal}
                  className="font-medium flex flex-row text-sm items-center border-2 border-transparent dark:border-white text-neutral-200 dark:text-white dark:hover:text-neutral-200/50 bg-neutral-900 dark:bg-transparent  dark:hover:bg-neutral-700 py-1.5 px-4 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faGreaterThan}
                    size="xs"
                    className="hidden md:block mr-0 xl:mr-2 text-neutral-200 dark:text-white"
                  />
                  <p className="hidden xl:block">Get Started</p>
                </button>
              )}
            </div>
          </div>
        </nav>
        {/* Mobile Menu */}
        <nav className="md:hidden fixed top-0 bg-white dark:bg-black z-50 w-full h-14 dark:border-neutral-900 border-b">
          <div className="flex items-center w-full px-0 h-full">
            <div className="flex justify-between items-center w-full h-full">
              <div className="flex items-center">
                <button
                  onClick={openMobileMenu}
                  data-testid="mobile-menu-button"
                  className="text-neutral-900 dark:text-neutral-200 cursor-pointer border-r border-neutral-300 dark:border-neutral-900 p-2"
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    size="lg"
                    className="text-neutral-900 dark:text-neutral-200 px-2"
                  />
                </button>
                {/* Logo */}
                <div className="px-4">
                  <Logo />
                </div>
              </div>
              <div className="flex flex-row items-center">
                {/* Search Icon */}
                <button
                  className="flex items-center text-neutral-900 dark:text-neutral-200 cursor-pointer pr-3"
                  onClick={toggleSearchBar}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    size="sm"
                    className="text-neutral-900 dark:text-neutral-200 px-2"
                  />
                </button>
                <button
                  onClick={openSignInModal}
                  className="text-sm text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700 py-2 px-3 border-l border-neutral-300 dark:border-neutral-900"
                  data-testid="mobile-menu-signin"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="sm"
                    className="text-neutral-900 dark:text-neutral-200 px-2"
                  />
                </button>
              </div>
            </div>
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
          <nav className="fixed bottom-0 left-0 w-full z-50 block lg:hidden">
            <div className="fixed inset-0 bg-neutral-700 opacity-40"></div>
            <div className="fixed bottom-0 left-0 w-full rounded-t-lg bg-neutral-200 dark:bg-black">
              <div className="p-4 pb-3 rounded-t-xl bg-neutral-200 dark:bg-black">
                {/* First Row */}
                <div className="flex justify-between items-center">
                  <h1 className="text-neutral-900 dark:text-neutral-200 font-bold text-2xl">
                    Menu
                  </h1>
                  <button
                    onClick={closeMobileMenu}
                    className="rounded-full p-2"
                    data-testid="mobile-menu-close"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      size="lg"
                      className="text-black dark:text-neutral-200"
                    />
                  </button>
                </div>
              </div>
              <div>
                {/* Second Row */}
                <div className="flex justify-between p-2 font-semibold text-base text-neutral-900 dark:text-neutral-200">
                  {userAuthenticated ? (
                    <button
                      className="flex-1 m-1 py-3 border border-black dark:border-neutral-200 rounded-3xl hover:bg-neutral-300 dark:hover:bg-neutral-900 dark:text-neutral-200"
                      data-testid="mobile-menu-profile"
                    >
                      Profile
                    </button>
                  ) : (
                    <button
                      onClick={openSignInModal}
                      className="flex-1 m-1 py-3 border border-black dark:border-neutral-200 rounded-3xl hover:bg-neutral-300 dark:hover:bg-neutral-900 dark:text-neutral-200"
                      data-testid="mobile-menu-signin"
                    >
                      Log In
                    </button>
                  )}
                  {userAuthenticated ? (
                    <button
                      onClick={logout}
                      className="flex-1 m-1 py-3 bg-blue-600 rounded-3xl hover:bg-blue-700 dark:text-neutral-200 text-neutral-200"
                      data-testid="mobile-menu-signup"
                    >
                      Log Out
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="dark:text-gray-300 text-neutral-200 ml-2"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={openSignUpModal}
                      className="flex-1 m-1 py-3 bg-blue-600 rounded-3xl hover:bg-blue-700 dark:text-neutral-200 text-neutral-200"
                      data-testid="mobile-menu-signup"
                    >
                      Get started
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="dark:text-gray-300 text-neutral-200 ml-2"
                      />
                    </button>
                  )}
                </div>
                {/* Third Row */}
                <button
                  onClick={() => handleSoundsClick()}
                  className="flex w-full p-5 items-center border-b border-neutral-300 dark:border-neutral-900 hover:cursor-pointer dark:font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:text-neutral-200"
                >
                  <FontAwesomeIcon icon={faMusic} className="text-lg mr-4" />
                  <p className="dark:text-neutral-200">Sounds</p>
                  <div className="flex-1"></div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="dark:text-neutral-200"
                  />
                </button>
                {genreItems.map((genre) => (
                  <button
                    key={genre.text}
                    onClick={() => handleGenreItemClick(genre.text)}
                    className="flex w-full p-5 items-center border-b border-neutral-300 dark:border-neutral-900 hover:cursor-pointer dark:font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:text-neutral-200"
                  >
                    <FontAwesomeIcon
                      icon={genre.icon}
                      className="text-lg mr-4"
                    />
                    <p className="text-base dark:text-neutral-100">
                      {genre.text}
                    </p>
                    <div className="flex-1"></div>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="dark:text-neutral-200"
                    />
                  </button>
                ))}{" "}
              </div>
            </div>
          </nav>
        )}
      </div>
      {authModalOpen && (
        <AuthModal
          closeAuthModal={closeAuthModal}
          form={form}
          setForm={setForm}
        />
      )}
    </header>
  );
};

export default Header;
