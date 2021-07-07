import { CODES } from '../constants';

// 初始化棋盘
export const initBoard = (width, height, mineCount) => {
	const candidates = Array(width * height).fill().map((v, i) => i);
	const shuffle = [];
	const boardData = [];

	while (candidates.length > width * height - mineCount) {
		const chosen = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
		shuffle.push(chosen);
	}

	for (let i = 0; i < height; i++) {
		const rowData = Array(width).fill(CODES.NOTHING);
		boardData.push(rowData);
	}

	for (let i = 0; i < shuffle.length; i++) {
		const x = shuffle[i] % width;
		const y = Math.floor(shuffle[i] / width);
		boardData[y][x] = CODES.MINE;
	}

	return boardData;
};

// 根据棋盘当前状态获取其下一个状态（右键时才使用
// 为了不丢失雷的信息，所以分了好几种状态
export const getNextCellCode = (code) => {
	switch (code) {
		case CODES.NOTHING: //没有雷
			return CODES.FLAG; //右键时设置为平地插旗
		case CODES.MINE://本来就是雷
			return CODES.MINE_FLAG; //右键，变为在雷上插旗状态
		case CODES.FLAG://平地插旗
			return CODES.QUESTION;//变成平地问号
		case CODES.MINE_FLAG://雷上插旗
			return CODES.MINE_QUESTION;//变成雷上问号
		case CODES.QUESTION://平地问号
			return CODES.NOTHING;//恢复成初始没有雷的状态
		case CODES.MINE_QUESTION://雷上问号
			return CODES.MINE;//恢复为本身的雷
		default:
			return code;
	}
};

export const getFlagIncDec = (code) => {
	switch (code) {
		case CODES.NOTHING:
		case CODES.MINE:
			return 1;
		case CODES.FLAG:
		case CODES.MINE_FLAG:
			return -1;
		default:
			return 0;
	}
};
//扩展棋盘信息（左键时调用，根据目前棋盘状况和点击的格子，返回新状况以及扩展的格子数量
export const expandOpenedCell = (boardData, x, y) => {
	let openedCellCount = 0;

	// Define function to get mine count
	const getMineCount = (x, y) => {
		let aroundCode = [];
		let mineCount = 0;

		aroundCode = boardData[y - 1] ? aroundCode.concat(boardData[y - 1][x - 1], boardData[y - 1][x], boardData[y - 1][x + 1]) : aroundCode;
		aroundCode = aroundCode.concat(boardData[y][x - 1], boardData[y][x + 1]);
		aroundCode = boardData[y + 1] ? aroundCode.concat(boardData[y + 1][x - 1], boardData[y + 1][x], boardData[y + 1][x + 1]) : aroundCode;

		mineCount = aroundCode.filter(v => [
			CODES.MINE,
			CODES.MINE_FLAG,
			CODES.MINE_QUESTION
		].includes(v)).length;

		return mineCount;
	};

	// Using DFS algorithm to expand
	const dfsSearch = (x, y) => {
		if (boardData[y][x] !== CODES.NOTHING) {
			return;
		}

		boardData[y][x] = getMineCount(x, y);
		openedCellCount++;

		let aroundPoint = [];
		aroundPoint = boardData[y - 1] ? aroundPoint.concat({ x: x - 1, y: y - 1 }, { x, y: y - 1 }, { x: x + 1, y: y - 1 }) : aroundPoint;
		aroundPoint = aroundPoint.concat({ x: x - 1, y }, { x: x + 1, y });
		aroundPoint = boardData[y + 1] ? aroundPoint.concat({ x: x - 1, y: y + 1 }, { x, y: y + 1 }, { x: x + 1, y: y + 1 }) : aroundPoint;

		if (boardData[y][x] === 0) {
			aroundPoint.forEach((v) => {
				dfsSearch(v.x, v.y);
			});
		}
	};

	dfsSearch(x, y);
	return { boardData, openedCellCount };
};