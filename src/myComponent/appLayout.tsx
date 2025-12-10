import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";

const AppLayout = () => {
  // Check if screen is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex direction="column" height="100vh">
      {/* Top Nav */}
      <Box
        bg="blue.600"
        color="white"
        p={4}
        fontWeight="bold"
        fontSize="lg"
        textAlign="center"
      >
        My Tailoring App
      </Box>

      <Flex flex="1">
        {/* Sidebar (hidden on mobile) */}
        {!isMobile && (
          <Box w="250px" bg="gray.100" p={4} borderRight="1px solid #ddd">
            Sidebar Content
          </Box>
        )}

        {/* MAIN AREA */}
        {isMobile ? (
          // 📱 Mobile: Single full-width content
          <Box flex="1" p={4}>
            Main Content
          </Box>
        ) : (
          // 💻 Desktop: Split into 2 equal parts
          <Flex flex="1" p={4} gap={4}>
            <Box
              flex="1"
              bg="gray.50"
              p={4}
              border="1px solid #ddd"
              borderRadius="md"
            >
              Left Main Section
            </Box>

            <Box
              flex="1"
              bg="gray.50"
              p={4}
              border="1px solid #ddd"
              borderRadius="md"
            >
              Right Main Section
            </Box>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AppLayout;
