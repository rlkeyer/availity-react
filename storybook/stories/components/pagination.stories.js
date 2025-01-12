import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, number, text } from '@storybook/addon-knobs';
import { Card, CardBody, CardText, CardTitle, Col } from 'reactstrap';

import {
  Pagination,
  PaginationContent,
  PaginationControls,
  AvResourcePagination,
} from '@availity/pagination';
import README from '@availity/pagination/README.md';
import paginationData from '@availity/mock/data/pagination.json';

import { Preview } from '../util';

const Component = ({ name, address }) => (
  <Card>
    <CardBody>
      <CardTitle>
        {name.first} {name.last}
      </CardTitle>
      <CardText className="mt-2" tag="div">
        <div className="label">Address</div>
        {address.street} <br />
        {address.city} {address.state} {address.postalCode}
      </CardText>
    </CardBody>
  </Card>
);

Component.propTypes = {
  name: PropTypes.object,
  address: PropTypes.object,
};

const mockResponse = {
  postGet: async (params = {}, config = {}) =>
    new Promise((resolve) =>
      setTimeout(() => {
        const { offset = 0, limit = 50 } = params;
        const notifications = paginationData.slice(offset, offset + limit);
        resolve({
          config,
          data: {
            totalCount: paginationData.length,
            count: notifications.length,
            offset,
            limit,
            notifications,
          },
        });
      }, 1000)
    ),
};

const resource = {
  postGet: mockResponse.postGet,
  getResult: 'notifications',
};

storiesOf('Components/Pagination', module)
  .addParameters({
    readme: {
      // Show readme at the addons panel
      sidebar: README,
      StoryPreview: Preview,
    },
  })
  .addDecorator(withKnobs)
  .add('default', () => {
    const infiniteScroll = boolean('Infinite Scroll', false);

    return (
      <Pagination
        itemsPerPage={number('Items Per page', 5, { min: 1 }) || 1}
        items={paginationData}
      >
        <div className="d-flex flex-column align-items-center">
          <Col xs={12}>
            <PaginationContent
              infiniteScroll={infiniteScroll}
              itemKey="id"
              loader={boolean('Show Loader', false)}
              loadingMessage={text('Loading Message', 'Loading')}
              component={Component}
            />
          </Col>
          {!infiniteScroll && (
            <PaginationControls
              className="pt-2"
              pageRange={number('Page Range', 5, { min: 1 }) || 1}
              breakLabel={boolean('Break Label', true)}
              marginPages={number('Margin Pages', 2, { min: 1 }) || 1}
              directionLinks={boolean('Direction Links', true)}
              autoHide={boolean('Auto Hide Controls', true)}
              aria-label="custom pagination label"
              listClassName={
                boolean('Unstyled', false) ? 'pagination-unstyled' : ''
              }
            />
          )}
        </div>
      </Pagination>
    );
  })
  .add('controls', () => (
    <Pagination items={paginationData}>
      <PaginationControls
        directionLinks={boolean('Direction Links', true)}
        autoHide={boolean('Auto Hide', true)}
      />
    </Pagination>
  ))
  .add('resource', () => {
    const infiniteScroll = boolean('Infinite Scroll', false);

    return (
      <AvResourcePagination
        resource={resource}
        itemsPerPage={number('Items Per page', 5, { min: 1 }) || 1}
      >
        <div className="d-flex flex-column align-items-center">
          <Col xs={12}>
            <PaginationContent
              infiniteScroll={infiniteScroll}
              itemKey="id"
              component={Component}
              loader={boolean('Show Loader', true)}
            />
          </Col>
          {!infiniteScroll && (
            <PaginationControls
              className="pt-2"
              pageRange={number('Page Range', 5, { min: 1 }) || 1}
              breakLabel={boolean('Break Label', true)}
              marginPages={number('Margin Pages', 2, { min: 1 }) || 1}
              directionLinks={boolean('Direction Links', true)}
            />
          )}
        </div>
      </AvResourcePagination>
    );
  });
