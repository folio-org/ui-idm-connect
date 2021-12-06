import React from 'react';
import { screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import ContractsForm from './ContractsForm';
// import userFixtures from '../../../test/jest/fixtures/user';

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderContractsForm = (initVal) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <Form
        onSubmit={jest.fn}
        render={() => (
          <ContractsForm
            handlers={{ onClose }}
            onSubmit={onSubmit}
            initialValues={initVal}
            isLoading={false}
            pristine
            submitting
          />
        )}
      />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('Create new contract - without initial values', () => {
  beforeEach(() => {
    renderContractsForm({});
  });

  it('should show pane title', () => {
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('should show all accordions', () => {
    expect(document.querySelector('#editPersonalAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContractAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContactAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editCommentAccordion')).toBeInTheDocument();
  });
});

