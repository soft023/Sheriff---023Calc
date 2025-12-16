import React, { useState } from "react";
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
  RadioGroup,
} from "@chakra-ui/react";
import { getReducingDecliningInterest } from "./helper";

type LoanType = "flat" | "reducing_equal" | "reducing_declining";

type ScheduleRow = {
  month: number;
  interest: number;
  principal: number;
  payment: number;
  balance: number;
};

const unformatNumber = (value: string) => Number(value.replace(/,/g, ""));

const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [tenor, setTenor] = useState("");
  const [rate, setRate] = useState("");
  const [loanType, setLoanType] = useState<LoanType>("flat");

  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayable, setTotalPayable] = useState<number | null>(null);

  const items = [
    { label: "Flat Rate", value: "flat" },
    { label: "Reducing Balance", value: "reducing_declining" },
    { label: "Reducing But Flat", value: "reducing_equal" },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    setAmount(raw === "" ? "" : Number(raw).toLocaleString());
  };

  const generateSchedule = (
    principal: number,
    annualRate: number,
    tenorMonths: number,
    type: LoanType
  ) => {
    const schedule: ScheduleRow[] = [];
    const r = annualRate / 100;

    // Flat
    if (type === "flat") {
      const totalInterest = principal * (annualRate / 100) * tenorMonths;
      const monthlyInterest = totalInterest / tenorMonths;
      const monthlyPrincipal = principal / tenorMonths;
      let bal = principal;

      for (let m = 1; m <= tenorMonths; m++) {
        bal -= monthlyPrincipal;
        schedule.push({
          month: m,
          interest: monthlyInterest,
          principal: monthlyPrincipal,
          payment: monthlyPrincipal + monthlyInterest,
          balance: Math.max(0, bal),
        });
      }

      return {
        schedule,
        totalInterest,
        totalPayable: principal + totalInterest,
      };
    }

    // Reducing – Equal EMI
    if (type === "reducing_equal") {
      const monthlyPrincipal = principal / tenorMonths;

      // 1️⃣ Get total interest from reducing declining
      const totalDecliningInterest = getReducingDecliningInterest(
        principal,
        r,
        tenorMonths
      );

      // 2️⃣ Spread it evenly
      const monthlyInterest = totalDecliningInterest / tenorMonths;

      const emi = monthlyPrincipal + monthlyInterest;

      let bal = principal;

      for (let m = 1; m <= tenorMonths; m++) {
        bal -= monthlyPrincipal;

        schedule.push({
          month: m,
          interest: monthlyInterest,
          principal: monthlyPrincipal,
          payment: emi,
          balance: m === tenorMonths ? 0 : Math.max(0, bal),
        });
      }

      return {
        schedule,
        totalInterest: totalDecliningInterest,
        totalPayable: principal + totalDecliningInterest,
      };
    }

    // Reducing – Declining
    const monthlyPrincipal = principal / tenorMonths;
    let bal = principal;
    let totalInt = 0;

    for (let m = 1; m <= tenorMonths; m++) {
      const interest = bal * r;
      bal -= monthlyPrincipal;
      totalInt += interest;

      schedule.push({
        month: m,
        interest,
        principal: monthlyPrincipal,
        payment: monthlyPrincipal + interest,
        balance: m === tenorMonths ? 0 : Math.max(0, bal),
      });
    }

    return {
      schedule,
      totalInterest: totalInt,
      totalPayable: principal + totalInt,
    };
  };

  const handleCalculate = () => {
    if (!amount || !tenor || !rate) return;

    const result = generateSchedule(
      unformatNumber(amount),
      Number(rate),
      Number(tenor),
      loanType
    );

    setSchedule(result.schedule);
    setTotalInterest(result.totalInterest);
    setTotalPayable(result.totalPayable);
  };

  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }}>
      {/* FORM */}
      <Card.Root>
        <CardBody>
          <Fieldset.Root>
            <VStack gap={4}>
              <Field.Root>
                <Field.Label>Loan Amount (₦)</Field.Label>
                <Input value={amount} onChange={handleAmountChange} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Tenor (months)</Field.Label>
                <Input
                  type="number"
                  value={tenor}
                  onChange={(e) => setTenor(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Interest Rate (%)</Field.Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <RadioGroup.Root
                  value={loanType}
                  onValueChange={(e) => setLoanType(e.value as LoanType)}
                >
                  <Flex direction={{ base: "column", sm: "row" }} gap={3}>
                    {items.map((item) => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </Flex>
                </RadioGroup.Root>
              </Field.Root>

              <Button w="100%" onClick={handleCalculate}>
                Calculate
              </Button>
            </VStack>
          </Fieldset.Root>
        </CardBody>
      </Card.Root>

      {/* SUMMARY */}
      {totalInterest !== null && (
        <Card.Root>
          <CardBody>
            <VStack align="stretch" fontSize={{ base: "sm", md: "md" }}>
              <Text>
                <b>Total Interest:</b> ₦{totalInterest.toLocaleString()}
              </Text>
              <Text>
                <b>Total Payable:</b> ₦{totalPayable?.toLocaleString()}
              </Text>
            </VStack>
          </CardBody>
        </Card.Root>
      )}

      {/* SCHEDULE */}
      {schedule.length > 0 && (
        <>
          {/* Desktop Table */}
          <Box display={{ base: "none", md: "block" }} overflowX="auto">
            <Box minW="700px">
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", fontWeight: "bold" }}>
                      Month
                    </th>
                    <th style={{ textAlign: "left", fontWeight: "bold" }}>
                      Interest
                    </th>
                    <th style={{ textAlign: "left", fontWeight: "bold" }}>
                      Principal
                    </th>
                    <th style={{ textAlign: "left", fontWeight: "bold" }}>
                      Payment
                    </th>
                    <th style={{ textAlign: "left", fontWeight: "bold" }}>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((r) => (
                    <tr key={r.month}>
                      <td>{r.month}</td>
                      <td>{Number(r.interest.toFixed(2)).toLocaleString()}</td>
                      <td>{Number(r.principal.toFixed(2)).toLocaleString()}</td>
                      <td>{Number(r.payment.toFixed(2)).toLocaleString()}</td>
                      <td>{Number(r.balance.toFixed(2)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>

          {/* Mobile Cards */}
          <VStack display={{ base: "flex", md: "none" }} gap={3}>
            {schedule.map((r) => (
              <Card.Root key={r.month}>
                <CardBody>
                  <Text>
                    <b>Month:</b> {r.month}
                  </Text>
                  <Text>
                    Interest: ₦{Number(r.interest.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text>
                    Principal: ₦
                    {Number(r.principal.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text>
                    Payment: ₦{Number(r.payment.toFixed(2)).toLocaleString()}
                  </Text>
                  <Text>
                    Balance: ₦{Number(r.balance.toFixed(2)).toLocaleString()}
                  </Text>
                </CardBody>
              </Card.Root>
            ))}
          </VStack>
        </>
      )}
    </Flex>
  );
};

export default LoanCalculator;
