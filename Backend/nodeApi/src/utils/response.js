export class Response {
    constructor(data = null, message = null, status) {
        // eslint-disable-next-line no-unused-expressions, no-sequences
        (this.data = data), (this.message = message);
    }

    success(res) {
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? 'Successfully'
        });
    }

    created(res) {
        return res.status(201).json({
            success: true,
            data: this.data,
            message: this.message ?? 'Successfully'
        });
    }

    erro500(res) {
        return res.status(500).json({
            success: false,
            data: this.data,
            message: this.message ?? 'Not Successfully!'
        });
    }

    err400(res) {
        return res.status(400).json({
            success: false,
            data: this.data,
            message: this.message ?? 'bad request'
        });
    }

    err401(res) {
        return res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? 'lutfen oturum acin'
        });
    }

    err404(res) {
        return res.status(404).json({
            success: false,
            data: this.data,
            message: this.message ?? 'not found'
        });
    }

    err429(res) {
        return res.status(429).json({
            success: false,
            data: this.data,
            message: this.message ?? 'many request!!'
        });
    }
}
