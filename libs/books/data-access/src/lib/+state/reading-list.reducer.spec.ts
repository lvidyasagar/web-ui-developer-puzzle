import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });
      const result: State = reducer(initialState, action);
      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('loadBooksError should load error for reading list', () => {
      const action = ReadingListActions.loadReadingListError({ error:'Error' });
      const result: State = reducer(initialState, action);
      expect(result.error).toBe('Error');
    });

    it('confirm AddToReadingList should add book to reading list', () => {
      const book =createBook('A');
      const action = ReadingListActions.confirmedAddToReadingList({ book });
      const result: State = reducer(initialState, action);
      expect(result.ids).toEqual(['A']);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A']);
    });

    it('confirm RemoveFromReadingList should remove book from reading list', () => {
      const item =createReadingListItem('A');
      const action = ReadingListActions.confirmedRemoveFromReadingList({ item });
      const result: State = reducer(initialState, action);
      expect(result.entities).toEqual({});
      expect(result.ids).toEqual([]);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});