import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import MarketplaceContract from '../build/contracts/Marketplace.json';

type Product = {
  id: number;
  name: string;
  price: string;
  owner: string;
  purchased: boolean;
};

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Partial<Contract>>();
  const [balance, setBalance] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [prodCount, setProdCount] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const networkId = await web3.eth.net.getId();

          const deployedNetwork = MarketplaceContract.networks[networkId];

          const contract = new web3.eth.Contract(MarketplaceContract.abi, deployedNetwork.address);
          setContract(contract);
        } else if (typeof window.web3 !== 'undefined') {
          const web3 = new Web3(window.web3.currentProvider);
          setWeb3(web3);

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = MarketplaceContract.networks[networkId];
          const contract = new web3.eth.Contract(MarketplaceContract.abi, deployedNetwork.address);
          setContract(contract);
        } else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // Account
  useEffect(() => {
    const getAccount = async () => {
      try {
        web3?.eth.getAccounts((err, res) => {
          setAccount(res![0]);
        });
      } catch (error) {
        console.error(error);
      }
    };
    getAccount();
  }, [web3]);

  // balance
  useEffect(() => {
    const getBalance = async () => {
      try {
        let balance = await web3?.eth.getBalance(account);
        balance = new Web3.utils.BN(balance);
        setBalance(balance!);
      } catch (error) {
        console.error(error);
      }
    };
    getBalance();
  }, [account, web3]);

  // Get products:
  useEffect(() => {
    async function getAllProducts(contractInstance: Partial<Contract> | undefined, productCount: number) {
      const products = [];
      for (let i = 0; i < productCount; i++) {
        const product = await contractInstance?.methods.products(i).call();
        products.push(product);
      }

      return products;
    }

    contract?.methods
      .productCount()
      .call()
      .then((res: number) => {
        setProdCount(res);
      });
    getAllProducts(contract, prodCount).then((products) => setProducts(products));
  }, [contract, prodCount]);

  const handleCreateProduct = async (values: { name: string; price: string }) => {
    try {
      const result = await contract?.methods
        .createProduct(values.name, web3?.utils.toWei(values.price, 'ether'))
        .send({ from: account });
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const handleExtractFunds = async () => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleCreateProduct,
    handleExtractFunds,
    address: account,
    balance: web3?.utils.fromWei(balance, 'ether'),
    account,
    products,
  };
};
