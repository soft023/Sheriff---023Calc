import { Box, Flex, Text, HStack, Tabs } from "@chakra-ui/react";
import { FaPiggyBank, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import { ColorMode } from "./colorMode";
import FixedDepositCalculator from "./fixedDeposit";
import LoanCalculator from "./loanCalc";

const AppLayout = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      {/* NAVBAR */}
      <Box
        px={{ base: 4, md: 6 }}
        py={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top="0"
        zIndex="1000"
        // bg="white"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <FaCalculator size={22} color="red" />
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
              Finance Tools
            </Text>
          </HStack>

          <ColorMode />
        </Flex>
      </Box>

      {/* TABS & MAIN */}
      <Tabs.Root
        defaultValue="term"
        orientation="horizontal"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {/* TAB HEADERS */}
        <Tabs.List
          borderBottom="1px solid"
          px={{ base: 2, md: 4 }}
          py={2}
          display="flex"
          justifyContent="space-evenly"
        >
          <Tabs.Trigger
            value="term"
            borderRadius="md"
            fontWeight="600"
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            _hover={{ bg: "green.100" }}
            _selected={{ color: "green.600", fontWeight: "bold" }}
          >
            <FaPiggyBank />
            Term Deposit
          </Tabs.Trigger>

          <Tabs.Trigger
            value="loan"
            borderRadius="md"
            fontWeight="600"
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            _hover={{ bg: "red.100" }}
            _selected={{ color: "red.500", fontWeight: "bold" }}
          >
            <FaMoneyBillWave />
            Loan
          </Tabs.Trigger>

          <Tabs.Indicator height="4px" />
        </Tabs.List>

        {/* MAIN CONTENT */}
        <Flex flex="1" justifyContent="center" overflowY="auto" p={4}>
          <Box
            width="100%"
            maxW={{ base: "100%", md: "700px" }}
            px={{ base: 2, md: 4 }}
          >
            {/* Term Deposit Content */}
            <Tabs.Content value="term">
              <Box
                border="2px solid"
                borderColor="green.300"
                borderRadius="lg"
                p={{ base: 4, md: 6 }}
                shadow="sm"
              >
                <FixedDepositCalculator />
              </Box>
            </Tabs.Content>

            {/* Loan Content */}
            <Tabs.Content value="loan">
              <Box
                border="2px solid"
                borderColor="red.300"
                borderRadius="lg"
                p={{ base: 4, md: 6 }}
                shadow="sm"
              >
                <LoanCalculator />
              </Box>
            </Tabs.Content>
          </Box>
        </Flex>
      </Tabs.Root>
    </Flex>
  );
};

export default AppLayout;
