import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Fieldset,
  Field,
  Input,
  VStack,
  Text,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";

const FixedDepositCalculator = () => {
  const [amount, setAmount] = useState("");
  const [tenor, setTenor] = useState("");
  const [rate, setRate] = useState("");

  const [result, setResult] = useState<null | {
    principal: number;
    tenor: number;
    rate: number;
    grossInterest: number;
    withholdingTax: number;
    netInterest: number;
  }>(null);

  // Converts "50,000" → 50000
  const unformatNumber = (value: string) => {
    return Number(value.replace(/,/g, ""));
  };

  // Formats 50000 → "50,000"
  const formatNumber = (num: number) => {
    if (!num) return "";
    return num.toLocaleString("en-US");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");

    // allow only digits
    if (!/^\d*$/.test(raw)) return;

    setAmount(formatNumber(Number(raw)));
  };

  const handleSubmit = () => {
    if (!amount || !tenor || !rate) return;

    const P = unformatNumber(amount);
    const T = Number(tenor);
    const R = Number(rate);

    const grossInterest = (P * R * T) / (100 * 365);
    const withholdingTax = grossInterest * 0.1;
    const netInterest = grossInterest - withholdingTax;

    setResult({
      principal: P,
      tenor: T,
      rate: R,
      grossInterest,
      withholdingTax,
      netInterest,
    });

    // ✅ Clear form after calculation
    setAmount("");
    setTenor("");
    setRate("");
  };

  return (
    <Flex direction="column" gap={6} p={6} maxW="500px" mx="auto">
      {/* FORM */}
      <Card.Root shadow="md">
        <CardBody>
          <VStack align="stretch">
            <Fieldset.Root invalid>
              <Field.Root>
                <Field.Label>Amount (₦)</Field.Label>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={() => setAmount(formatNumber(unformatNumber(amount)))}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Tenor (Days)</Field.Label>
                <Input
                  type="number"
                  placeholder="Enter tenor in days"
                  value={tenor}
                  onChange={(e) => setTenor(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Interest Rate (%)</Field.Label>
                <Input
                  type="number"
                  placeholder="Enter interest rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </Field.Root>

              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleSubmit}
                disabled={!amount || !tenor || !rate}
              >
                Calculate
              </Button>
            </Fieldset.Root>
          </VStack>
        </CardBody>
      </Card.Root>

      {/* RESULT */}
      {result && (
        <Card.Root shadow="lg" border="1px solid #e2e8f0">
          <CardBody>
            <Card.Title mt="2" mb={4}>
              Calculation Result
            </Card.Title>

            <VStack align="stretch">
              <Text>
                <b>Principal Amount:</b> ₦{result.principal.toLocaleString()}
              </Text>
              <Text>
                <b>Tenor in Days:</b> {result.tenor}
              </Text>
              <Text>
                <b>Interest Rate (%):</b> {result.rate}%
              </Text>
              <Text>
                <b>Gross Interest:</b> ₦
                {Number(result.grossInterest.toFixed(2)).toLocaleString()}
              </Text>
              <Text>
                <b>Withholding Tax (10%):</b> ₦
                {Number(result.withholdingTax.toFixed(2)).toLocaleString()}
              </Text>
              <Text>
                <b>Net Interest:</b> ₦
                {Number(result.netInterest.toFixed(2)).toLocaleString()}
              </Text>
            </VStack>
          </CardBody>
        </Card.Root>
      )}
    </Flex>
  );
};

export default FixedDepositCalculator;
