import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';

const ContractsFilters = ({
  activeFilters = { status: [] },
  filterHandlers,
}) => {
  const [filterState, setFilterState] = useState({ status: [] });

  useEffect(() => {
    const newState = {};
    const arr = [];

    filterConfig.forEach(filter => {
      const newValues = [];
      let values = {};
      // get filte values from filterConfig
      values = filter.values;

      values.forEach((key) => {
        let newValue = {};
        newValue = {
          value: key.cql,
          label: key.name,
        };
        newValues.push(newValue);
      });

      arr[filter.name] = newValues;

      if (filterState[filter.name] && arr[filter.name].length !== filterState[filter.name].length) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  }, [filterState]);

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-idm-connect.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key]}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('status')}
    </AccordionSet>
  );
};

ContractsFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default ContractsFilters;
