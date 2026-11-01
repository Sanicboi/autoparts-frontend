import ExcelJS from 'exceljs'

export const importNumbers = async (file: File): Promise<string[]> => {
  const workbook = new ExcelJS.Workbook()

  const arrayBuffer = await file.arrayBuffer()
  await workbook.xlsx.load(arrayBuffer)

  const worksheet = workbook.worksheets[0]

  if (!worksheet) {
    return []
  }

  const values: string[] = []

  worksheet.getColumn('A').eachCell((cell) => {
    if (cell.value !== null && cell.value !== undefined) {
      values.push(String(cell.text))
    }
  })

  return values
}

export const exportNumbers = async (
  data: {
    part: string
    exist: number
    adeo: number
    autodoc: number
  }[],
) => {
  const workbook = new ExcelJS.Workbook()

  const sheet = workbook.addWorksheet('Main')
  const vinCell = sheet.getCell('A1')
  vinCell.value = 'Артикул'
  const existCell = sheet.getCell('B1')
  existCell.value = 'Exist цена'
  const autodocCell = sheet.getCell('C1')
  autodocCell.value = 'Autodoc цена'
  const adeoCell = sheet.getCell('D1')
  adeoCell.value = 'Adeo цена'
  for (let i = 0; i < data.length; i++) {
    const n = sheet.getCell(`A${i + 2}`)
    const e = sheet.getCell(`B${i + 2}`)
    const autod = sheet.getCell(`C${i + 2}`)
    const adeo = sheet.getCell(`D${i + 2}`)
    n.value = data[i]!.part
    e.value = data[i]!.exist > 0 ? data[i]!.exist : 'Не найдено'
    autod.value = data[i]!.autodoc > 0 ? data[i]!.autodoc : 'Не найдено'
    adeo.value = data[i]!.adeo > 0 ? data[i]!.adeo : 'Не найдено'
  }

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'result.xlsx'
  link.click()

  URL.revokeObjectURL(url)
}
