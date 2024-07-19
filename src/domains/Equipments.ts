export interface Equipment {
    equipment_type: string,
    mark_type: string,
    equipment_name: String,
    equipment_desc: String,
    equipment_status: string,
    equipment_category: string,
    equipment_sub_category: string,
    date_init: string | Date,
    date_prev: string | Date,
    image_equipment: BinaryType,
    latitude: number,
    longitude: number
};