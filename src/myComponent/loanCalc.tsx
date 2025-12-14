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
  HStack,
  RadioGroup,
} from "@chakra-ui/react";

type LoanType = "flat" | "reducing_equal" | "reducing_declining";

type ScheduleRow = {
  month: number;
  interest: number;
  principal: number;
  payment: number;
  balance: number;
};

const unformatNumber = (value: string) => Number(value.replace(/,/g, ""));
const formatNumber = (num: number) =>
  isNaN(num) ? "" : Math.round(num * 100) / 100;

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
    { label: "Reducing - Equal MOnthly", value: "reducing_equal" },
    { label: "Reducing Balance", value: "reducing_declining" },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    setAmount(raw === "" ? "" : Number(raw).toLocaleString("en-US"));
  };

  const generateSchedule = (
    principal: number,
    annualRate: number,
    tenorMonths: number,
    type: LoanType
  ) => {
    const schedule: ScheduleRow[] = [];
    const r = annualRate / 12 / 100;

    // --- Flat Rate ---
    if (type === "flat") {
      const years = tenorMonths / 12;
      const totalInterest = principal * (annualRate / 100) * years;
      const monthlyInterest = totalInterest / tenorMonths;
      const monthlyPrincipal = principal / tenorMonths;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;
      let bal = principal;

      for (let m = 1; m <= tenorMonths; m++) {
        bal -= monthlyPrincipal;
        schedule.push({
          month: m,
          interest: monthlyInterest,
          principal: monthlyPrincipal,
          payment: monthlyPayment,
          balance: Math.max(0, bal),
        });
      }

      return {
        schedule,
        totalInterest,
        totalPayable: principal + totalInterest,
      };
    }

    // --- Amortized (Equal Monthly Repayment) ---
    if (type === "reducing_equal") {
      const emi =
        (principal * r * Math.pow(1 + r, tenorMonths)) /
        (Math.pow(1 + r, tenorMonths) - 1);
      let bal = principal;
      let totalInt = 0;

      for (let m = 1; m <= tenorMonths; m++) {
        const interestPaid = bal * r;
        const principalPaid = emi - interestPaid;
        bal -= principalPaid;
        totalInt += interestPaid;

        schedule.push({
          month: m,
          interest: interestPaid,
          principal: principalPaid,
          payment: emi,
          balance: m === tenorMonths ? 0 : Math.max(0, bal),
        });
      }

      return {
        schedule,
        totalInterest: totalInt,
        totalPayable: principal + totalInt,
      };
    }

    // --- Straight Line Reducing (Declining Payment) ---
    if (type === "reducing_declining") {
      const monthlyPrincipal = principal / tenorMonths;
      let bal = principal;
      let totalInt = 0;

      for (let m = 1; m <= tenorMonths; m++) {
        const interestPaid = bal * r;
        const payment = monthlyPrincipal + interestPaid;
        bal -= monthlyPrincipal;
        totalInt += interestPaid;

        schedule.push({
          month: m,
          interest: interestPaid,
          principal: monthlyPrincipal,
          payment,
          balance: m === tenorMonths ? 0 : Math.max(0, bal),
        });
      }

      return {
        schedule,
        totalInterest: totalInt,
        totalPayable: principal + totalInt,
      };
    }

    return { schedule, totalInterest: 0, totalPayable: principal };
  };

  const handleCalculate = () => {
    if (!amount || !tenor || !rate) return;

    const P = unformatNumber(amount);
    const T = Number(tenor);
    const R = Number(rate);

    if (isNaN(P) || isNaN(T) || isNaN(R) || P <= 0 || T <= 0) return;

    const {
      schedule: sch,
      totalInterest: ti,
      totalPayable: tp,
    } = generateSchedule(P, R, T, loanType);

    setSchedule(sch);
    setTotalInterest(ti);
    setTotalPayable(tp);
  };

  return (
    <Flex direction="column" gap={6}>
      {/* FORM */}
      <Card.Root shadow="md">
        <CardBody>
          <VStack align="stretch">
            <Fieldset.Root>
              <Field.Root>
                <Field.Label>Loan Amount (₦)</Field.Label>
                <Input
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={() => {
                    const raw = amount.replace(/,/g, "");
                    if (raw === "") return;
                    setAmount(Number(raw).toLocaleString("en-US"));
                  }}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Tenor (months)</Field.Label>
                <Input
                  type="number"
                  placeholder="Enter tenor in months"
                  value={tenor}
                  onChange={(e) => setTenor(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label htmlFor="loanAmount">
                  Interest Rate (%)
                </Field.Label>
                <Input
                  type="number"
                  placeholder="Enter annual interest rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                {/* <Field.Label>Loan Type</Field.Label>
                <RadioGroup.Root
                  value={loanType}
                  onValueChange={(details) =>
                    setLoanType(details.value as LoanType)
                  }
                >
                  <HStack>
                    <RadioGroup.Item value="flat">
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>Flat Rate</RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="reducing_equal">
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>
                        Amortized (EMI – Equal Monthly)
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="reducing_declining">
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>
                        Straight Line Reducing (Declining Payment)
                      </RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </HStack>
                </RadioGroup.Root> */}

                <RadioGroup.Root
                  value={loanType}
                  onValueChange={(e) =>
                    setLoanType((e.value as LoanType) ?? loanType)
                  }
                >
                  <HStack gap="6">
                    {items.map((item) => (
                      <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </HStack>
                </RadioGroup.Root>
              </Field.Root>

              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleCalculate}
                disabled={!amount || !tenor || !rate}
              >
                Calculate
              </Button>
            </Fieldset.Root>
          </VStack>
        </CardBody>
      </Card.Root>

      {/* SUMMARY */}
      {totalInterest !== null && totalPayable !== null && (
        <Card.Root shadow="lg" border="1px solid #e2e8f0">
          <CardBody>
            <Card.Title mb={3}>Loan Summary</Card.Title>
            <VStack align="stretch">
              <Text>
                <b>Loan Amount:</b> ₦{unformatNumber(amount).toLocaleString()}
              </Text>
              <Text>
                <b>Tenor:</b> {tenor} months
              </Text>
              <Text>
                <b>Rate:</b> {rate}%
              </Text>
              <Text>
                <b>Loan Type:</b>{" "}
                {loanType === "flat"
                  ? "Flat Rate"
                  : loanType === "reducing_equal"
                  ? "Amortized (EMI – Equal Monthly)"
                  : "Straight Line Reducing (Declining Payment)"}
              </Text>
              <Text>
                <b>Total Interest:</b> ₦
                {Number(totalInterest).toFixed(2).toLocaleString()}
              </Text>
              <Text>
                <b>Total Payable:</b> ₦
                {Number(totalPayable).toFixed(2).toLocaleString()}
              </Text>
            </VStack>
          </CardBody>
        </Card.Root>
      )}

      {/* REPAYMENT SCHEDULE */}
      {schedule.length > 0 && (
        <Box mt={2} overflowX="auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ fontWeight: "bold" }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Month</th>
                <th style={{ textAlign: "right", padding: "8px" }}>
                  Interest (₦)
                </th>
                <th style={{ textAlign: "right", padding: "8px" }}>
                  Principal (₦)
                </th>
                <th style={{ textAlign: "right", padding: "8px" }}>
                  Total Payment (₦)
                </th>
                <th style={{ textAlign: "right", padding: "8px" }}>
                  Balance (₦)
                </th>
              </tr>
            </thead>

            <tbody>
              {schedule.map((row) => (
                <tr
                  key={row.month}
                  style={{ borderBottom: "1px solid #f0f4f8" }}
                >
                  <td style={{ padding: "8px" }}>{row.month}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    {Number(row.interest.toFixed(2)).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    {Number(row.principal.toFixed(2)).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    {Number(row.payment.toFixed(2)).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    {Number(row.balance.toFixed(2)).toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ padding: "8px" }}>TOTAL</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {Number(
                    schedule.reduce((a, b) => a + b.interest, 0).toFixed(2)
                  ).toLocaleString()}
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {Number(
                    schedule.reduce((a, b) => a + b.principal, 0).toFixed(2)
                  ).toLocaleString()}
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {Number(
                    schedule.reduce((a, b) => a + b.payment, 0).toFixed(2)
                  ).toLocaleString()}
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>0</td>
              </tr>
            </tbody>
          </table>
        </Box>
      )}
    </Flex>
  );
};

export default LoanCalculator;
