import React, { ReactNode, useState } from 'react';
import { Layout } from '@src/layouts';
import { Meta } from '@src/containers/Meta';
import { Button, Flex, Input } from '@chakra-ui/react';
import { Typography } from '@src/components/Typography';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

const Balances = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const checkBalance = async (address: string) => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    try {
      const fetched = await client.readContract({
        address: USDC,
        abi,
        functionName: 'balanceOf',
        args: [address]
      });
      console.log(fetched);
      setBalance(Number(fetched) / 10 ** 6); // USDC has 6 decimals
    } catch (e) {
      setBalance(0);
      console.error(e);
    }
  };

  return (
    <div className="h-full">
      <Meta title="Balances: Check Contract Balance." description="" />
      <Flex
        className="max-w-[1200px] w-full mx-auto h-full item-center"
        align={'center'}
      >
        <Flex
          borderRadius={'12px'}
          className="bg-secondary "
          flexDirection={'column'}
          h="fit-content"
          px="16px"
          w="100%"
          maxWidth="480px"
          mx="auto"
        >
          <Typography type="headline5" className="text-primary" my="16px">
            Check USDC Balance
          </Typography>

          <Input
            sx={{
              fontSize: {
                xs: '24px',
                md: '26px',
                lg: '28px'
              }
            }}
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value ?? '')}
            color="text.primary"
            mb="8px"
          />

          <Typography type="headline5" className="text-primary" my="8px">
            {balance}
          </Typography>

          <Button
            colorScheme="brand"
            size="md"
            bgColor="bg.brand !important"
            rounded="full"
            px={4}
            py={1}
            my="16px"
            onClick={() => checkBalance(address)}
            color="bg.default"
            borderRadius={'8px'}
          >
            Check Balance
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

Balances.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default Balances;
