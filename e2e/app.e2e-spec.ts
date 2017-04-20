import { BETSQUARESPage } from './app.po';

describe('betsquares App', () => {
  let page: BETSQUARESPage;

  beforeEach(() => {
    page = new BETSQUARESPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
