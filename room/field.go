package room

var (
	fieldBasic = [][]int{
		[]int{1},
		[]int{1},
		[]int{},
		[]int{1},
		[]int{1, 1, 1},
		[]int{1, 1, 1},
		[]int{1, 1, 1},
		[]int{1, 1},
		[]int{},
		[]int{},
		[]int{},
		[]int{},
		[]int{0, 0, 0, 0, 1},
		[]int{0, 0, 0, 0, 1},
		[]int{0, 0, 0, 0, 1},
		[]int{0, 0, 0, 0, 1},
	}

	fieldOne = []*field{}

	// FieldDump ...
	FieldDump = make(map[string]interface{})
)

type field struct {
	Physics
	id int
	t  fieldType
}

type fieldType uint32

func initField() {

	id := 0

	for x, row := range fieldBasic {
		for y, p := range row {

			if p < 1 {
				continue
			}

			id++
			f := &field{
				id: id,
			}

			f.W = 1
			f.H = 1
			f.X = float64(x)
			f.Y = float64(y)

			// j.Log(`field`, f.X, f.Y, f)

			fieldOne = append(fieldOne, f)
		}
	}

	// j.Log(fieldOne)

	list := []interface{}{}

	for _, v := range fieldOne {

		a := make(map[string]interface{})
		a[`id`] = v.id
		a[`x`] = v.X
		a[`y`] = v.Y

		list = append(list, a)
	}
	FieldDump[`list`] = list
}
