import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import  { Menu as MuiMenu } from "@mui/material" ;
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { styled } from "@mui/material/styles";
import { useNavigate, useMatch, useResolvedPath } from "react-router-dom";
import ReactVivus from "react-vivus";
import logo from "./home_images/logo.svg";

import { COLORS } from "./helpers";


const Menu = (props) => {
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClickMenu = (link) => {
    setAnchorElNav(null);
    navigate(link);
  };

  const LogoButton = styled(Button)(({ theme }) => ({
    color: COLORS.primary,
    textTransform: "none",
    borderRadius: 10,
    padding: 0,
    marginLeft: 0,
    "&:hover": {
      backgroundColor: "white",
    },
  }));

  const NavButton = styled(Button)(({ theme }) => ({
    color: "black",
    textTransform: "none",
    fontSize: 20,
    //border: `2px ${COLORS.secondary} solid`,
    borderRadius: 10,
    padding: 10,
    marginLeft: 20,
    "&:hover": {
      backgroundColor: COLORS.primary,
      color: "white",
    },
  }));

  const NavLink = ({ children, to, ...props }) => {
    let navigate = useNavigate();
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
      <NavButton
        variant="text"
        sx={{
          marginTop:1.5,
          backgroundColor: match ? COLORS.primary : "white",
          color: match ? "white" : "black",
        }}
        onClick={() => navigate(to)}
      >
        {children}
      </NavButton>
    );
  };
  function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  return (
    <HideOnScroll {...props}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          position: "fixed",
          backgroundColor: "white",
          color: "black",
          borderBottom: (t) => `0px solid ${t.palette.divider}`,
        }}
      >
        <Container sx={{ margin: 0, padding: 0 }} maxWidth="xl">
          <Toolbar sx={{ margin: 0, padding: 0 }} disableGutters>
            <Box
              sx={{
                marginLeft: 0,
                marginRight: 0,
                padding: 0,
                flexGrow: 0,
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  display: { xs: "flex", md: "none" },
                }}
              >
                <MenuIcon />
              </IconButton>
              <MuiMenu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  key={"create"}
                  onClick={() => handleClickMenu("/create")}
                >
                  <Typography textAlign="center">Create Poll</Typography>
                </MenuItem>
                <MenuItem
                  key={"about"}
                  onClick={() => handleClickMenu("/about")}
                >
                  <Typography textAlign="center">About</Typography>
                </MenuItem>
                <MenuItem
                  key={"contact"}
                  onClick={() => handleClickMenu("/contact")}
                >
                  <Typography textAlign="center">Contact</Typography>
                </MenuItem>
              </MuiMenu>
            </Box>
            <LogoButton
              variant="text"
              sx={{
                marginLeft: 0,
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => navigate("/")}
            >

            
            <Avatar
                    alt="Logo"
                    sx={{
                      background:"white",
                      minWidth:   "65px",
                      minHeight:  "65px",
                      marginRight: 1,
                    }}
                  >
                    <ReactVivus
                      id="logosvg"
                      option={{
                        file: logo,
                        animTimingFunction: "EASE",
                        type: "sync",
                      }}
                      style={{
                        height:   "40px",
                        width:   "40px",
                      }}
                    />
                    
                  </Avatar>
                      </LogoButton>
            <LogoButton
              variant="text"
              sx={{
                marginLeft: 0,
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => navigate("/")}
            >
              <Typography
                sx={{
                  display: "box",
                  align: "middle",
                  fontWeight: 700,
                  mr: 2,
                  fontSize: { lg: 30, md: 24, sm: 20, xs: 20 },
                }}
              >
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>                     
                  <Box component="span" sx={{paddingTop:1}}>
                  Stable Voting
                  </Box>
                  </Box>
              </Typography>
            </LogoButton>

            <LogoButton
              variant="text"
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                display: { xs: "flex", md: "none" },
              }}
              onClick={() => navigate("/")}
            >
              <Typography
                sx={{
                  align: "middle",
                  marginLeft: "auto",
                  marginRight: "auto",
                  paddingRight: 5,
                  fontWeight: 700,
                  mr: 2,
                  flexGrow: 0,
                  display: { xs: "flex", md: "none" },
                  textAlign: "center",
                  fontSize: { lg: 30, md: 24, sm: 22, xs: 22 },
                }}
              >
                Stable Voting
              </Typography>
            </LogoButton>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <NavLink to="/create">Create Poll</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};
export default Menu;
