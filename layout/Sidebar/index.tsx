import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import CloseIcon from "../../public/icons/close.svg";
import Logo from "./icons/logo.svg";
import MiniLogo from "./icons/mini-logo.svg";
import DasboardActive from "./icons/dashboard-active.svg";
import { routes } from "./routes";
import {
  setIsFullWidthMenu,
  setOpen as setOpenMenu,
} from "@/redux/mobileMenu/slice";
import { TelegramChat } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { selectMenu } from "@/redux/mobileMenu/selector";
import styles from "./Sidebar.module.scss";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import useUser from "@/hooks/useUser";
import { EventBtn } from "@/components/UI/EventBtn";

export interface SidebarProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  mobile?: boolean;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { openMenu, isFullWidthMenu } = useSelector(selectMenu);
  const dispatch = useDispatch();
  const { route } = useRouter();
  const user = useUser();
  const handleOpen = () => {
    if (!openMenu) {
      dispatch(setIsFullWidthMenu(!isFullWidthMenu));
    }
  };

  useEffect(() => {
    if (openMenu) {
      dispatch(setIsFullWidthMenu(true));
    }
  }, [openMenu]);

  return (
    <div className={clsx(className, styles.container)}>
      <motion.div
        initial={false}
        animate={{
          width:
            isFullWidthMenu && openMenu
              ? "100%"
              : isFullWidthMenu
              ? "256px"
              : "102px",
        }}
        className={styles.sidebar}
      >
        <div
          className={styles.logoContainer}
          style={
            !openMenu && isFullWidthMenu ? { marginLeft: "-70px" } : undefined
          }
          onClick={handleOpen}
        >
          {isFullWidthMenu ? (
            <div className={styles.logo}>
              <Logo />
              {openMenu && (
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={() => dispatch(setOpenMenu(false))}
                />
              )}
            </div>
          ) : (
            <div className={styles.miniLogo}>
              <MiniLogo />
            </div>
          )}
        </div>
        <ul
          className={clsx(styles.routes, { [styles.mobileRoutes]: openMenu })}
        >
          <li
            onClick={() => {
              openMenu && dispatch(setOpenMenu(false));
            }}
          >
            <Link
              href={routes[0].path}
              className={clsx(
                styles.link,
                route === routes[0].path && styles.activeLink,
                {
                  [styles.activeRouteMobile]:
                    openMenu && route === routes[0].path,
                },
                { [styles.mobileSidebarRoute]: openMenu }
              )}
            >
              <div
                className={clsx(
                  route === routes[0].path && styles.activeRouteIcon
                )}
              >
                {/* {routes[0].icon} */}
                {route === "/" && <DasboardActive />}
                {route !== "/" && routes[0].icon}
              </div>
              {isFullWidthMenu && <p>{routes[0].name}</p>}
              <div
                className={clsx(
                  route === routes[0].path && styles.activeBorder
                )}
              />
            </Link>
          </li>
          <li
            onClick={() => {
              openMenu && dispatch(setOpenMenu(false));
            }}
          >
            <Link
              href={routes[1].path}
              className={clsx(
                styles.link,
                routes[1].path === route && styles.activeLink,
                {
                  [styles.activeRouteMobile]:
                    openMenu && route === routes[1].path,
                },
                { [styles.mobileSidebarRoute]: openMenu }
              )}
            >
              <div
                className={clsx(
                  route === routes[1].path && styles.activeRouteIcon
                )}
              >
                {routes[1].icon}
              </div>
              {isFullWidthMenu && <p>{routes[1].name}</p>}
              <div
                className={clsx(
                  route === routes[1].path && styles.activeBorder
                )}
              />
            </Link>
          </li>
          <li
            onClick={() => {
              openMenu && dispatch(setOpenMenu(false));
            }}
          >
            <Link
              href={routes[2].path}
              className={clsx(
                styles.link,
                route.includes(routes[2].path) && styles.activeLink,
                {
                  [styles.activeRouteMobile]:
                    openMenu && route.includes(routes[2].path),
                },
                {
                  [styles.activeRouteMobile]:
                    openMenu && route.includes(routes[2].path),
                },
                { [styles.mobileSidebarRoute]: openMenu }
              )}
            >
              <div
                className={clsx(
                  route.includes(routes[2].path) && styles.activeRouteIcon
                )}
              >
                {routes[2].icon}
              </div>
              {isFullWidthMenu && <p>{routes[2].name}</p>}
              <div
                className={clsx(
                  route === routes[2].path && styles.activeBorder
                )}
              />
            </Link>
          </li>
          <li
            onClick={() => {
              openMenu && dispatch(setOpenMenu(false));
            }}
          >
            <Link
              href={routes[3].path}
              className={clsx(
                styles.link,
                route === routes[3].path && styles.activeLink,
                {
                  [styles.activeRouteMobile]:
                    openMenu && route === routes[3].path,
                },
                { [styles.mobileSidebarRoute]: openMenu }
              )}
            >
              <div
                className={clsx(
                  route === routes[3].path && styles.activeRouteIcon
                )}
              >
                {routes[3].icon}
              </div>
              {isFullWidthMenu && <p>{routes[3].name}</p>}
              <div
                className={clsx(
                  route === routes[3].path && styles.activeBorder
                )}
              />
            </Link>
          </li>
          <div
            className={clsx(styles.settings, {
              [styles.mobileSettings]: openMenu,
            })}
          >
            <li
              onClick={() => {
                openMenu && dispatch(setOpenMenu(false));
              }}
            >
              <Link
                href={routes[4].path}
                className={clsx(
                  styles.link,
                  route.includes(routes[4].path) && styles.activeLink,
                  {
                    [styles.activeRouteMobile]:
                      openMenu && route.includes(routes[4].path),
                  },
                  { [styles.mobileSidebarRoute]: openMenu }
                )}
              >
                <div
                  className={clsx(
                    route === routes[4].path && styles.activeRouteIcon
                  )}
                >
                  {routes[4].icon}
                </div>
                {isFullWidthMenu && <p>{routes[4].name}</p>}
                <div
                  className={clsx(
                    route === routes[4].path && styles.activeBorder
                  )}
                />
              </Link>
            </li>
            {user?.role === "администратор" && (
              <li
                onClick={() => {
                  openMenu && dispatch(setOpenMenu(false));
                }}
              >
                <Link
                  href={routes[5].path}
                  className={clsx(
                    styles.link,
                    route === routes[5].path && styles.activeLink,
                    {
                      [styles.activeRouteMobile]:
                        openMenu && route === routes[5].path,
                    },
                    { [styles.mobileSidebarRoute]: openMenu }
                  )}
                >
                  <div
                    className={clsx(
                      route === routes[5].path && styles.activeRouteIcon
                    )}
                  >
                    {routes[5].icon}
                  </div>
                  {isFullWidthMenu && <p>{routes[5].name}</p>}
                  <div
                    className={clsx(
                      route === routes[5].path && styles.activeBorder
                    )}
                  />
                </Link>
              </li>
            )}

            <li
              onClick={() => {
                openMenu && dispatch(setOpenMenu(false));
              }}
            >
              <Link
                href={routes[6].path}
                className={clsx(
                  styles.link,
                  route === routes[6].path && styles.activeLink,
                  {
                    [styles.activeRouteMobile]:
                      openMenu && route === routes[6].path,
                  },
                  { [styles.mobileSidebarRoute]: openMenu }
                )}
              >
                <div
                  className={clsx(
                    route === routes[6].path && styles.activeRouteIcon
                  )}
                >
                  {routes[6].icon}
                </div>
                {isFullWidthMenu && <p>{routes[6].name}</p>}
                <div
                  className={clsx(
                    route === routes[6].path && styles.activeBorder
                  )}
                />
              </Link>
            </li>

          </div>
        </ul>
        <div className={styles.linkContainer}>
        <div className={styles.telegramLink}>
          <EventBtn
            variant={isFullWidthMenu ? "open" : "closed"}
            className={clsx(styles.telegram, {
              [styles.mobileButton]: openMenu,
            })}
          />
        </div>
          <div className={styles.telegramLink} style={{marginTop: "20px"}}>
            <TelegramChat
              variant={isFullWidthMenu ? "open" : "closed"}
              className={clsx(styles.telegram, {
                [styles.mobileButton]: openMenu,
              })}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
