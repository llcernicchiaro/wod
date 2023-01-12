import React, { FC, ReactNode } from "react";
import { Box, Container } from "@mui/material";
import Navbar from "./navbar";

type Props = {
  children?: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        <Container>
          <Box sx={{ flexGrow: 1, mt: 4 }}>{children}</Box>
        </Container>
      </main>
    </>
  );
};
