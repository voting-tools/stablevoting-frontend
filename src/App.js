import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";

import { COLORS_RGB } from "./components/helpers";

import Footer  from "./components/Footer";
import Menu    from "./components/Menu";
import Home    from "./components/Home";
import Contact from "./components/Contact";
import Create  from "./components/Create";
import Demo    from "./components/Demo";
import Vote    from "./components/Vote";
import Admin   from "./components/Admin";
import About   from "./components/About";
import Results from "./components/Results";
import Research from "./components/Research";
import FAQ      from "./components/FAQ";
import Privacy  from "./components/Privacy";

let theme = createTheme({
  palette: {
    primary: {
      main: `rgb(${COLORS_RGB.primary})`,
    },
  },
});
theme = responsiveFontSizes(theme);

function App() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="admin/:id" element={<Admin />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="create" element={<Create />} />
                <Route path="demo" element={<Demo />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="research" element={<Research />} />
                <Route path="results/:id" element={<Results />} />
                <Route path="vote/:id" element={<Vote />} />
                <Route path="vote/:id/:allowmultiple" element={<Vote />} />
                {/*
                <Route path="about" element={<About />} />
              <Route path="addpoll" element={<AddPoll />} />
              <Route path="vote/:id/:allowmultiple" element={<Vote />} />
              */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </DndProvider>
    </>
  );
}

function Layout() {
  return (
    <>
      <Menu />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <div style={{ marginTop: 80, flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h4" variant="h4" align="center">
          Page Not Found
        </Typography>
      </Paper>
    </Container>
  );
};

export default App;
