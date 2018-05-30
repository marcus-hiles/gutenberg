/**
 * Internal dependencies
 */
import { getAssociatedGuide, isTipVisible } from '../selectors';

describe( 'selectors', () => {
	describe( 'getAssociatedGuide', () => {
		const state = {
			guides: [
				[ 'test/tip-1', 'test/tip-2', 'test/tip-3' ],
				[ 'test/tip-a', 'test/tip-b', 'test/tip-c' ],
				[ 'test/tip-α', 'test/tip-β', 'test/tip-γ' ],
			],
			preferences: {
				dismissedTips: {
					'test/tip-1': true,
					'test/tip-a': true,
					'test/tip-b': true,
					'test/tip-α': true,
					'test/tip-β': true,
					'test/tip-γ': true,
				},
			},
		};

		it( 'should return null when there is no associated guide', () => {
			expect( getAssociatedGuide( state, 'test/unknown' ) ).toBeNull();
		} );

		it( 'should return the associated guide', () => {
			expect( getAssociatedGuide( state, 'test/tip-2' ) ).toEqual( {
				tipIDs: [ 'test/tip-1', 'test/tip-2', 'test/tip-3' ],
				currentTipID: 'test/tip-2',
				nextTipID: 'test/tip-3',
			} );
		} );

		it( 'should indicate when there is no next tip', () => {
			expect( getAssociatedGuide( state, 'test/tip-b' ) ).toEqual( {
				tipIDs: [ 'test/tip-a', 'test/tip-b', 'test/tip-c' ],
				currentTipID: 'test/tip-c',
				nextTipID: null,
			} );
		} );

		it( 'should indicate when there is no current or next tip', () => {
			expect( getAssociatedGuide( state, 'test/tip-β' ) ).toEqual( {
				tipIDs: [ 'test/tip-α', 'test/tip-β', 'test/tip-γ' ],
				currentTipID: null,
				nextTipID: null,
			} );
		} );
	} );

	describe( 'isTipVisible', () => {
		it( 'should return true by default', () => {
			const state = {
				guides: [],
				preferences: {
					areTipsDisabled: false,
					dismissedTips: {},
				},
			};
			expect( isTipVisible( state, 'test/tip' ) ).toBe( true );
		} );

		it( 'should return false if tips are disabled', () => {
			const state = {
				guides: [],
				preferences: {
					areTipsDisabled: true,
					dismissedTips: {},
				},
			};
			expect( isTipVisible( state, 'test/tip' ) ).toBe( false );
		} );

		it( 'should return false if the tip is dismissed', () => {
			const state = {
				guides: [],
				preferences: {
					areTipsDisabled: false,
					dismissedTips: {
						'test/tip': true,
					},
				},
			};
			expect( isTipVisible( state, 'test/tip' ) ).toBe( false );
		} );

		it( 'should return false if the tip is in a guide and it is not the current tip', () => {
			const state = {
				guides: [
					[ 'test/tip-1', 'test/tip-2', 'test/tip-3' ],
				],
				preferences: {
					areTipsDisabled: false,
					dismissedTips: {},
				},
			};
			expect( isTipVisible( state, 'test/tip-2' ) ).toBe( false );
		} );
	} );
} );