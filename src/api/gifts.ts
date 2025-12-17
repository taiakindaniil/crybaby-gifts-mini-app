import apiClient from './apiClient';
import type { Gift } from '@/types/gift';

// Типы для гридов и строк
export interface GridRow {
    row_index: number;
    cells: (Gift | null)[];
}

export interface Grid {
    id: number;
    name: string;
    rows: GridRow[];
}

export const createGrid = async (name: string) => {
    const res = await apiClient.post(`/me/grids`, { name })
    return res.data
}

export const deleteGrid = async (id: number) => {
    const res = await apiClient.delete(`/me/grids/${id}`)
    return res.data
}

// GET все гриды с их строками и ячейками
export const getGrids = async (userId: number): Promise<Grid[]> => {
    const { data } = await apiClient.get(`/users/${userId}/grids`); // пример user_id
    // Если нужно, можно трансформировать данные сразу в нужный формат
    return data.map((grid: any) => ({
      id: grid.id,
      name: grid.name,
      rows: grid.rows.map((row: any) => ({
        row_index: row.row_index,
        cells: row.cells.map((cell: (Gift | null)) => (cell ? cell : null)),
      })),
    }));
};

// GET все гриды и rows, возвращаем плоский список подарков
// export const getGifts = async (): Promise<Gift[]> => {
//   const { data } = await api.get('/users/307291324/grids'); // пример
//   const gifts: Gift[] = [];
//   data.forEach((grid: any) => {
//     grid.rows.forEach((row: any) => {
//       row.cells.forEach((cell: any) => {
//         gifts.push(cell);
//       });
//     });
//   });
//   console.log(gifts)
//   return gifts;
// };

// POST добавление строки
export const addRow = async (gridId: number) => {
  const { data } = await apiClient.post(`/grids/${gridId}/rows`, {});
  return data;
};


export const updateGiftCell = async (
    gridId: number,
    rowIndex: number,
    cellIndex: number,
    gift: Gift | null
) => {
    return await apiClient.put(
      `/grids/${gridId}/rows/${rowIndex}/cells/${cellIndex}`,
      { gift }
    )
}