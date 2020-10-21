import React from 'react';
import { shallow } from 'enzyme';
import StripeIdentity from '../src/StripeIdentity';

const render = (overrideProps) => (
  <StripeIdentity
    redirectUrl="https://verify.stripe.com/start#XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    refreshUrl="https://example.com/refresh"
    {...overrideProps}
  />
);

describe('<StripeIdentity />', () => {
  it('renders props correctly', () => {
    const wrapper = shallow(render());
    expect(wrapper).toMatchSnapshot();
  });

  it('renders props correctly - extra props', () => {
    const wrapper = shallow(render({
      onSuccess: jest.fn(),
      onCancel: jest.fn(),
      onLoadingComplete: jest.fn(),
      renderOnComplete: jest.fn(),
    }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders props correctly - webViewProps', () => {
    const wrapper = shallow(
      render({
        webViewProps: {
          originWhitelist: ['https://stripe.com'],
        },
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders props correctly - options', () => {
    const wrapper = shallow(
      render({
        options: {
          htmlContentLoading: '<p>htmlContentLoading test</p>',
          htmlContentError: '<p>htmlContentError test</p>',
        },
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });
});
