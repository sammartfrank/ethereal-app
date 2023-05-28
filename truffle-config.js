module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
  },
  mocha: {},
  contracts_directory: './contracts/',
  contracts_build_directory: './build/contracts/',
  compilers: {
    solc: {
      version: '0.8.20+commit.a1b79de6.Darwin.appleclang',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
