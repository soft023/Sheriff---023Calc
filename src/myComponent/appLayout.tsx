import {
  Box,
  Flex,
  Text,
  HStack,
  Tabs,
  // useColorModeValue,
} from "@chakra-ui/react";
import { FaPiggyBank, FaMoneyBillWave, FaCalculator } from "react-icons/fa";
import { ColorMode } from "./colorMode";
import FixedDepositCalculator from "./fixedDeposit";
import LoanCalculator from "./loanCalc";

const AppLayout = () => {
  // const bg = useColorModeValue("white", "gray.900");
  // const border = useColorModeValue("gray.200", "gray.700");
  // const tabHover = useColorModeValue("gray.100", "gray.800");

  return (
    <Flex direction="column" height="100vh">
      {/* NAVBAR */}
      <Box
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <FaCalculator size={22} color="red" />
            <Text fontWeight="bold" fontSize="lg">
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
          // borderColor="green"
          // bg={bg}
          px={4}
          py={2}
          display="flex"
          justifyContent="space-evenly"
          gap={2}
        >
          <Tabs.Trigger
            value="term"
            // px={4}
            // py={3}
            borderRadius="md"
            fontWeight="600"
            width="100%"
            display="flex"
            justifyContent="center"
            // gap={2}
            alignItems="center"
            _hover={{ bg: "green.100" }}
            _selected={{ color: "green.600", fontWeight: "bold" }}
          >
            <FaPiggyBank />
            Term Deposit
          </Tabs.Trigger>

          <Tabs.Trigger
            value="loan"
            // px={4}
            // py={3}
            borderRadius="md"
            fontWeight="600"
            width="100%"
            display="flex"
            justifyContent="center"
            gap={2}
            alignItems="center"
            _hover={{ bg: "red.100" }}
            _selected={{ color: "red.500", fontWeight: "bold" }}
          >
            <FaMoneyBillWave />
            Loan
          </Tabs.Trigger>

          <Tabs.Indicator height="5px" />
        </Tabs.List>

        {/* MAIN CONTENT */}
        <Flex flex="1" overflowY="auto" justifyContent="center" p={4}>
          <Box
            width="100%"
            maxW={{ base: "100%", md: "700px" }}
            p={{ base: 0, md: 4 }}
          >
            {/* Term Deposit Content */}
            <Tabs.Content value="term">
              <Box
                border="2px solid"
                borderColor="green"
                borderRadius="lg"
                p={4}
                shadow="sm"
                // bg="green"
              >
                <FixedDepositCalculator />
              </Box>
            </Tabs.Content>

            {/* Loan Content */}
            <Tabs.Content value="loan">
              <Box
                textAlign="center"
                fontSize="lg"
                p={6}
                border="2px solid"
                borderColor="red"
                borderRadius="lg"
                shadow="sm"
                // bg={bg}
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
