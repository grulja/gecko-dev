use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize)]
struct Config {
    float: (f32, f64),
    tuple: TupleStruct,
    map: HashMap<u8, char>,
    nested: Nested,
    var: Variant,
    array: Vec<()>,
}

#[derive(Serialize)]
struct TupleStruct((), bool);

#[derive(Serialize)]
enum Variant {
    A(u8, &'static str),
}

#[derive(Serialize)]
struct Nested {
    a: String,
    b: char,
}

const EXPECTED: &str = "(
    float: (2.18, -1.1),
    tuple: ((), false),
    map: {8: '1'},
    nested: (a: \"a\", b: 'b'),
    var: A(255, \"\"),
    array: [(), (), ()],
)";

#[test]
fn depth_limit() {
    let data = Config {
        float: (2.18, -1.1),
        tuple: TupleStruct((), false),
        map: vec![(8, '1')].into_iter().collect(),
        nested: Nested {
            a: "a".to_owned(),
            b: 'b',
        },
        var: Variant::A(!0, ""),
        array: vec![(); 3],
    };

    let pretty = ron::ser::PrettyConfig::new()
        .depth_limit(1)
        .separate_tuple_members(true)
        .enumerate_arrays(true)
        .new_line("\n");
    let s = ron::ser::to_string_pretty(&data, pretty);

    assert_eq!(s, Ok(EXPECTED.to_string()));
}
