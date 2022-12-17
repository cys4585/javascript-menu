/* eslint-disable */
const MissionUtils = require('@woowacourse/mission-utils');
const App = require('../src/App');

const mockQuestions = (answers) => {
	MissionUtils.Console.readLine = jest.fn();
	answers.reduce((acc, input) => {
		return acc.mockImplementationOnce((_, callback) => {
			callback(input);
		});
	}, MissionUtils.Console.readLine);
};

const mockRandoms = (numbers) => {
	MissionUtils.Random.pickNumberInRange = jest.fn();
	numbers.reduce((acc, number) => {
		return acc.mockReturnValueOnce(number);
	}, MissionUtils.Random.pickNumberInRange);
};

const mockShuffles = (rows) => {
	MissionUtils.Random.shuffle = jest.fn();

	rows.reduce((acc, [firstNumber, numbers]) => {
		return acc.mockReturnValueOnce([
			firstNumber,
			...numbers.filter((number) => number !== firstNumber),
		]);
	}, MissionUtils.Random.shuffle);
};

const getLogSpy = () => {
	const logSpy = jest.spyOn(MissionUtils.Console, 'print');
	return logSpy;
};

const getOutput = (logSpy) => {
	return [...logSpy.mock.calls].join('');
};

const expectLogContains = (received, logs) => {
	logs.forEach((log) => {
		expect(received).toEqual(expect.stringContaining(log));
	});
};

describe('점심 메뉴 테스트1', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('전체 기능 테스트', () => {
		test('카테고리 중복(2회), 메뉴 중복(2회) 있는 추천', () => {
			const logSpy = getLogSpy();

			mockRandoms([2, 5, 5, 1, 3]);
			mockQuestions(['구구,제임스', '김밥', '떡볶이']);

			const sequenced = (_, idx) => idx + 1;
			mockShuffles([
				// 구구
				[2, Array.from({ length: 9 }, sequenced)],
				[7, Array.from({ length: 9 }, sequenced)],
				[7, Array.from({ length: 9 }, sequenced)],
				[1, Array.from({ length: 9 }, sequenced)],
				[4, Array.from({ length: 9 }, sequenced)],
				[2, Array.from({ length: 9 }, sequenced)],

				//제임스
				[9, Array.from({ length: 9 }, sequenced)],
				[1, Array.from({ length: 9 }, sequenced)],
				[5, Array.from({ length: 9 }, sequenced)],
				[5, Array.from({ length: 9 }, sequenced)],
				[4, Array.from({ length: 9 }, sequenced)],
			]);

			const app = new App();
			app.play();
			const log = getOutput(logSpy);

			expect(log.replace(/\n/g, '')).toEqual(
				expect.stringContaining(
					[
						'점심 메뉴 추천을 시작합니다.',
						'메뉴 추천 결과입니다.',
						'[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]',
						'[ 카테고리 | 한식 | 양식 | 양식 | 일식 | 중식 ]',
						'[ 구구 | 김치찌개 | 스파게티 | 라자냐 | 스시 | 볶음면 ]',
						'[ 제임스 | 제육볶음 | 라자냐 | 프렌치 토스트 | 가츠동 | 짜장면 ]',
						'추천을 완료했습니다.',
					].join(''),
				),
			);
		});
	});
});

describe('점심 메뉴 테스트2', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('전체 기능 테스트', () => {
		test('카테고리 중복(2회), 안먹는 메뉴 있는 추천', () => {
			const logSpy = getLogSpy();

			mockRandoms([2, 5, 5, 1, 3]);
			mockQuestions(['구구,제임스', '김밥', '떡볶이']);

			const sequenced = (_, idx) => idx + 1;
			mockShuffles([
				// 구구
				[2, Array.from({ length: 9 }, sequenced)],
				[7, Array.from({ length: 9 }, sequenced)],
				[1, Array.from({ length: 9 }, sequenced)],
				[4, Array.from({ length: 9 }, sequenced)],
				[2, Array.from({ length: 9 }, sequenced)],

				//제임스
				[8, Array.from({ length: 9 }, sequenced)],
				[9, Array.from({ length: 9 }, sequenced)],
				[1, Array.from({ length: 9 }, sequenced)],
				[5, Array.from({ length: 9 }, sequenced)],
				[5, Array.from({ length: 9 }, sequenced)],
				[4, Array.from({ length: 9 }, sequenced)],
			]);

			const app = new App();
			app.play();
			const log = getOutput(logSpy);

			expect(log.replace(/\n/g, '')).toEqual(
				expect.stringContaining(
					[
						'점심 메뉴 추천을 시작합니다.',
						'메뉴 추천 결과입니다.',
						'[ 구분 | 월요일 | 화요일 | 수요일 | 목요일 | 금요일 ]',
						'[ 카테고리 | 한식 | 양식 | 양식 | 일식 | 중식 ]',
						'[ 구구 | 김치찌개 | 스파게티 | 라자냐 | 스시 | 볶음면 ]',
						'[ 제임스 | 제육볶음 | 라자냐 | 프렌치 토스트 | 가츠동 | 짜장면 ]',
						'추천을 완료했습니다.',
					].join(''),
				),
			);
		});
	});
});
