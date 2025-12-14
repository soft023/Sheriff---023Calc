import { Flex, Text, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex justify="center" mt="50px">
      <Text color="gray.500" fontSize="sm">
        <i>
          Developed with ❤️ by{" "}
          <Link
            href="mailto:fasasisheriffdeen@gmail.com"
            fontWeight="bold"
            // color="red.600"
            color="gray.500"
            _hover={{
              textDecoration: "none",
              color: "blue.600",
            }}
          >
            Sheriffdeen Fasasi
          </Link>
        </i>
      </Text>
    </Flex>
  );
}
