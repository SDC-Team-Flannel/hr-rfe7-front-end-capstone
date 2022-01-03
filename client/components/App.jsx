import React, { Component } from 'react';

import { THEMES } from '../settings/colors';
import styled, { ThemeProvider } from 'styled-components';
import { ProductDetail } from './ProductDetail';
import { QuestionsAnswers } from './QuestionsAnswers';
import { RatingsReviews } from './RatingsReviews';
import { RelatedItems } from './RelatedItems';
import { Header } from './Header/Header';
import api from '../api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentProduct: null,
      // relatedProducts: null,
      reviewData: null,
      darkMode: false,
    };
  }

  fetchReviewData({ product_id, page = 1, count = 100, sort = 'newest' }) {
    api.getReviewData({ product_id, page, count, sort }, false).then((res) => {
      this.setState({ reviewData: res });
    });
  }

  componentDidMount() {
    api.getProducts({ count: 100 }).then((products) => {
      api.getAllData({ product_id: products[0].id }).then((data) => {
        this.setState({
          products: products,
          currentProduct: data.currentProduct,
          // relatedProducts: data.relatedProducts,
          reviewData: data.reviewData,
        });
      });
    });
  }

  //Handler to update the main product
  updateProduct(id) {
    api.getAllData({ product_id: id }).then((data) => {
      this.setState({
        currentProduct: data.currentProduct,
        reviewData: data.reviewData,
      });
    });
  }

  render() {
    const { products, currentProduct, darkMode } = this.state;
    return (
      <ThemeProvider theme={THEMES[darkMode ? 'darkMode' : 'default']}>
        <Header
          toggleColors={() => this.setState({ darkMode: !darkMode })}
          products={products}
          product={currentProduct}
          updateProduct={(id) => this.updateProduct(id)}
        />
        <Container>
          <ProductDetail
            product={currentProduct}
            updateProduct={(id) => this.updateProduct(id)}
            productReviews={this.state.reviewData}
          />
          <RelatedItems
            product={currentProduct}
            updateProduct={(id) => this.updateProduct(id)}
            rating={this.state.reviewData}
            state={this.state}
          />
          <QuestionsAnswers
            product={currentProduct}
            updateProduct={(id) => this.updateProduct(id)}
          />
          {this.state.reviewData && (
            <RatingsReviews
              data={this.state.reviewData}
              product={currentProduct}
              fetch={(params) => this.fetchReviewData(params)}
            />
          )}
        </Container>
      </ThemeProvider>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${(props) => props.theme.bgLight};
`;

export default App;
