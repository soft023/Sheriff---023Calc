import {
  Box,
  Flex,
  Text,
  Button,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPiggyBank, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import { ColorMode } from "./colorMode";

const AppLayout = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Track which tab is active — default is Term Deposit
  const [activeTab, setActiveTab] = useState<"term" | "loan">("term");

  return (
    <Flex direction="column" height="100vh">
      {/* Top Navbar */}
      <Box p={4} fontWeight="bold" fontSize="lg" textAlign="center">
        <Flex justifyContent="space-between">
          <FaCalculator color="red" />
          <ColorMode />
        </Flex>
      </Box>

      <Flex flex="1">
        {/* LEFT SIDEBAR (hidden on mobile) */}
        {!isMobile && (
          <Box w="200px" p={4} borderRight="1px solid #ddd">
            {/* BUTTONS */}
            <Flex direction="column" gap={3}>
              <Button
                colorScheme={activeTab === "term" ? "blue" : "gray"}
                variant={activeTab === "term" ? "solid" : "outline"}
                onClick={() => setActiveTab("term")}
                width="100%"
              >
                <HStack>
                  <FaPiggyBank size={20} />
                  <Text> Term Deposit</Text>
                </HStack>
              </Button>

              <Button
                colorScheme={activeTab === "loan" ? "blue" : "gray"}
                variant={activeTab === "loan" ? "solid" : "outline"}
                onClick={() => setActiveTab("loan")}
                width="100%"
              >
                <HStack>
                  <FaMoneyBillWave size={20} />
                  <Text> Loan</Text>
                </HStack>
              </Button>
            </Flex>
          </Box>
        )}

        {/* MAIN CONTENT */}
        <Flex flex="1" p={4} gap={4}>
          {isMobile ? (
            // 📱 MOBILE — show single main content
            <Box flex="1" p={4} border="1px solid #ddd" borderRadius="md">
              {activeTab === "term" ? "Term Deposit Content" : "Loan Content"}
            </Box>
          ) : (
            // 💻 DESKTOP — split main into two equal parts
            <>
              <Box flex="1" p={4} border="1px solid #ddd" borderRadius="md">
                {activeTab === "term" ? "Term Deposit Content" : "Loan Content"}
              </Box>

              <Box flex="1" p={4} border="1px solid #ddd" borderRadius="md">
                {/* You can add more content here later */}
                Additional Info
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppLayout;
