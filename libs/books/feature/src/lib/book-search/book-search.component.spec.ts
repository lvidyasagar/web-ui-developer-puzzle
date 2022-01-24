import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

import {
  searchBooks,
  addToReadingList,
  getAllBooks,
  clearSearch,
} from '@tmo/books/data-access';
import { MemoizedSelector } from '@ngrx/store';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let mockStore: MockStore;
  let mockBookSelector: MemoizedSelector<any, any>;
  const initialState = { entities: {}, ids: [], loaded: false };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockBookSelector = mockStore.overrideSelector(getAllBooks, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should return correct date format', () => {
    const date = '2011-01-15T00:00:00.000Z';
    const expectDateFormat = '1/15/2011';
    const result = component.formatDate(date);
    expect(result).toEqual(expectDateFormat);
  });

  it('should call search book action with correct search word ', () => {
    const expectedAction = searchBooks({ term: 'Javascript' });
    spyOn(mockStore, 'dispatch').and.callThrough();
    component.searchForm.controls.term.setValue('Javascript');
    component.searchBooks();
    fixture.detectChanges();
    expect(component.searchForm.valid).toBeTruthy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should call clear search book action when search word is empty or null', () => {
    const expectedAction = clearSearch();
    spyOn(mockStore, 'dispatch').and.callThrough();
    component.searchForm.controls.term.setValue(null);
    component.searchBooks();
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should call add to reading list action with correct book', () => {
    const book = createBook('A');
    const expectedAction = addToReadingList({ book });
    spyOn(mockStore, 'dispatch').and.callThrough();
    component.addBookToReadingList(book);
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should call searchExample function when click on Javascript link without search', () => {
    const expectedAction = searchBooks({ term: 'javascript' });
    spyOn(mockStore, 'dispatch').and.callThrough();
    component.searchExample();
    fixture.detectChanges();
    expect(component.searchForm.valid).toBeTruthy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});