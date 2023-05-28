'use client';
import { useFormik } from 'formik';
import { useWeb3 } from '@/hooks';

const Navbar = ({ address, balance }: { address: string; balance?: string }) => (
  <nav className='flex justify-between items-center py-4 px-6 bg-gray-800 text-white w-full'>
    <p className='text-lg'>
      Account: <span className='font-semibold'>{address}</span>
    </p>
    <p className='text-lg'>
      Balance: <span className='font-semibold'>{balance} ETH</span>
    </p>
  </nav>
);

export default function Home() {
  const { handleCreateProduct, handleExtractFunds, address, balance, products } = useWeb3();

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
    },
    onSubmit: (values) => handleCreateProduct(values),
  });

  return (
    <div className='h-screen flex flex-col bg-black text-white'>
      <Navbar address={address} balance={balance} />

      <div className='flex flex-col justify-center items-center flex-grow'>
        <div className='w-full max-w-lg'>
          <div className='bg-gray-700 p-6 rounded-lg shadow-md mb-6'>
            <h2 className='text-2xl font-bold mb-3 text-gray-300'>Add Product</h2>
            <form onSubmit={formik.handleSubmit}>
              <input
                type='text'
                name='name'
                className='w-full py-2 px-3 rounded-full mb-3 bg-gray-800 text-white'
                placeholder='Product Name'
                onChange={formik.handleChange}
                value={formik.values.name}
              />

              <input
                type='text'
                name='price'
                className='w-full py-2 px-3 rounded-full mb-3 bg-gray-800 text-white'
                placeholder='Price in ETH'
                onChange={formik.handleChange}
                value={formik.values.price}
              />

              <button
                type='submit'
                className='w-full py-3 text-lg font-semibold rounded-full bg-gray-600 hover:bg-gray-500 mb-6'
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
      {products.map((product) => (
        <div key={product.id} className='p-4 mb-4 rounded bg-gray-700'>
          <h3 className='text-2xl font-bold text-gray-200'>{product.name}</h3>
          <p className='text-gray-300'>Price: {product.price} ETH</p>
          <p className='text-gray-300'>Owner: {product.owner}</p>
          <p className='text-gray-300'>Purchased: {product.purchased ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}
