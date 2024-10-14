import React from "react";

const Form = () => {
  return (
    <section className='py-12 dark:bg-dark'>
      <div className='container'>
        <div className='-mx-4 flex flex-wrap'>
          <DefaultColumn>
            <DefaultInput />
          </DefaultColumn>

          <DefaultColumn>
            <ActiveInput />
          </DefaultColumn>

          <DefaultColumn>
            <NameInput />
          </DefaultColumn>

          <DefaultColumn>
            <EmailInput />
          </DefaultColumn>

          <DefaultColumn>
            <CompanyNameInput />
          </DefaultColumn>

          <DefaultColumn>
            <CurrencyInput />
          </DefaultColumn>
        </div>
      </div>
    </section>
  );
};

export default Form;

const DefaultColumn = ({ children }) => {
  return (
    <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
      <div className='mb-12'>{children}</div>
    </div>
  );
};

const DefaultInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Default Input
      </label>
      <input
        type='text'
        placeholder='Default Input'
        className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary'
      />
    </>
  );
};

const ActiveInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Active Input
      </label>
      <input
        type='text'
        placeholder='Active Input'
        className='w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-5 outline-none transition focus:border-primary'
      />
    </>
  );
};

const NameInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Name
      </label>
      <div className='relative'>
        <input
          type='text'
          placeholder='Devid Jhon'
          className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary'
        />
        <span className='absolute top-1/2 left-4 -translate-y-1/2'>
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.72 12.886a4.167 4.167 0 0 1 2.947-1.22h6.666a4.167 4.167 0 0 1 4.167 4.167v1.666a.833.833 0 1 1-1.667 0v-1.666a2.5 2.5 0 0 0-2.5-2.5H6.667a2.5 2.5 0 0 0-2.5 2.5v1.666a.833.833 0 1 1-1.667 0v-1.666a4.17 4.17 0 0 1 1.22-2.947ZM10 3.333a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-4.166 2.5a4.167 4.167 0 1 1 8.333 0 4.167 4.167 0 0 1-8.333 0Z"
              opacity={0.8}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#9CA3AF"
            />
          </svg>
        </span>
      </div>
    </>
  );
};

const EmailInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Email
      </label>
      <div className='relative'>
        <input
          type='email'
          placeholder='info@yourmail.com'
          className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary'
        />
        <span className='absolute top-1/2 left-4 -translate-y-1/2'>
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity={0.8} fillRule="evenodd" clipRule="evenodd" fill="#9CA3AF">
              <path d="M3.334 4.167A.838.838 0 0 0 2.501 5v10c0 .456.377.833.833.833h13.333a.838.838 0 0 0 .834-.833V5a.838.838 0 0 0-.834-.833H3.334ZM.834 5c0-1.377 1.123-2.5 2.5-2.5h13.333c1.377 0 2.5 1.123 2.5 2.5v10c0 1.377-1.123 2.5-2.5 2.5H3.334a2.505 2.505 0 0 1-2.5-2.5V5Z" />
              <path d="M.985 4.522a.833.833 0 0 1 1.16-.205l7.856 5.499 7.855-5.5a.833.833 0 1 1 .956 1.366l-8.333 5.833a.833.833 0 0 1-.956 0L1.19 5.682a.833.833 0 0 1-.205-1.16Z" />
            </g>
          </svg>
        </span>
      </div>
    </>
  );
};

const CompanyNameInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Company Name
      </label>
      <div className='relative'>
        <input
          type='text'
          placeholder='Pimjo Labs'
          className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary'
        />
        <span className='absolute top-1/2 left-4 -translate-y-1/2'>
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity={0.8}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.33398 6.66667C2.87375 6.66667 2.50065 7.03976 2.50065 7.5V15.8333C2.50065 16.2936 2.87375 16.6667 3.33398 16.6667H16.6673C17.1276 16.6667 17.5007 16.2936 17.5007 15.8333V7.5C17.5007 7.03976 17.1276 6.66667 16.6673 6.66667H3.33398ZM0.833984 7.5C0.833984 6.11929 1.95327 5 3.33398 5H16.6673C18.048 5 19.1673 6.11929 19.1673 7.5V15.8333C19.1673 17.214 18.048 18.3333 16.6673 18.3333H3.33398C1.95327 18.3333 0.833984 17.214 0.833984 15.8333V7.5Z"
                fill="#9CA3AF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.56622 2.39825C7.03506 1.92941 7.67094 1.66602 8.33398 1.66602H11.6673C12.3304 1.66602 12.9662 1.92941 13.4351 2.39825L15.2842 4.24632C15.5972 4.55929 15.5972 5.07362 15.2842 5.3866C14.9712 5.69957 14.4569 5.69957 14.1439 5.3866L12.2948 3.53853C12.1985 3.44224 12.0366 3.33334 11.6673 3.33334H8.33398C7.96471 3.33334 7.80282 3.44224 7.70654 3.53853L5.85747 5.3866C5.5445 5.69957 5.03017 5.69957 4.7172 5.3866C4.40423 5.07362 4.40423 4.55929 4.7172 4.24632L6.56622 2.39825Z"
                fill="#9CA3AF"
              />
            </g>
          </svg>
        </span>
      </div>
    </>
  );
};

const CurrencyInput = () => {
  return (
    <>
      <label className='mb-[10px] block text-base font-medium text-dark dark:text-white'>
        Currency
      </label>
      <div className='relative'>
        <span className='absolute top-1/2 left-4 -translate-y-1/2 text-dark-6'>
          $
        </span>
        <input
          type='text'
          placeholder='0.00'
          className='w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] pr-3 pl-8 text-dark-6 outline-none transition focus:border-primary'
        />
      </div>
    </>
  );
};
