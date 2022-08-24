import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { blue } from '@mui/material/colors';

type PageProps = {
    title: string;
    description: string;
    children: ReactNode;
}

export const Page = ({
    title,
    description,
    children,
}: PageProps) => {
    return (
        <>
            <Box sx={{
                background: blue[600],
                width: '100%',
                marginBottom: '-4rem',
                paddingTop: '4rem',
                paddingBottom: '8rem',
            }}>
                <Container>
                    <Typography variant="h1">{title}</Typography>
                    <Typography>{description}</Typography>
                </Container>
            </Box>
            <Box>
                <Container>
                    <main>
                        {children}
                    </main>
                </Container>
            </Box>
        </>
    )
}