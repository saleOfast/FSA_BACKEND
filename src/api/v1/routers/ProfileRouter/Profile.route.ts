import express, { Request, Response } from "express";
import catchAsync from '../../../../core/utils/catch-async';
import { AccessTokenService, ResponseHandler } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import ProfileController from "../../Controllers/profileController/profile.controller";
// import { profileService } from "../../Controllers/AuthController/ProfileController/Profile.Controller";

const router = express.Router();

// Create profile
router.post('/create', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const data = await ProfileController.createProfile(req.body, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Get user profile by emp_id from token - must be defined before :profileId route
router.get('/get', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
  try {
    const payload: IUser = RequestHandler.Custom.getUser(req);
    // const profileController = new ProfileController();
    const data = await ProfileController.getProfile(payload.emp_id);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
}));

// Catalog routes — must be before /:profileId
router.get('/catalog/objects', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const data = await ProfileController.getObjectsCatalog();
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/catalog/fields', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const objectName = req.query.objectName;
    if (!objectName || typeof objectName !== "string") {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: "Query objectName is required" });
    }
    let profileId: number | undefined;
    const rawPid = req.query.profileId;
    if (rawPid != null && String(rawPid).trim() !== "") {
      const n = parseInt(String(rawPid), 10);
      if (Number.isNaN(n)) {
        return ResponseHandler.sendErrorResponse(res, { status: 400, message: "Invalid profileId" });
      }
      profileId = n;
    }
    const data = await ProfileController.getFieldCatalog(objectName, profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

function parseOptionalProfileId(req: Request): number | undefined {
  const raw = req.query.profileId;
  if (raw == null || String(raw).trim() === "") return undefined;
  const n = parseInt(String(raw), 10);
  if (Number.isNaN(n)) return undefined;
  return n;
}

router.get('/catalog/tabs', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const profileId = parseOptionalProfileId(req);
    const data = await ProfileController.getTabsCatalog(profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/catalog/object-permissions', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const profileId = parseOptionalProfileId(req);
    const data = await ProfileController.getObjectPermissionsCatalog(profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/catalog/record-types', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const objectName = req.query.objectName;
    if (!objectName || typeof objectName !== "string") {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: "Query objectName is required" });
    }
    const profileId = parseOptionalProfileId(req);
    const data = await ProfileController.getRecordTypeCatalog(objectName, profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/catalog/sync', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (_req: Request, res: Response) => {
  try {
    const data = await ProfileController.syncMetadataCatalog();
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Get all profiles with pagination - must be defined before :profileId route
router.get('/all', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: 'Invalid pagination parameters' });
    }
    
    const data = await ProfileController.getAllProfiles(page, limit);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    console.error('Error in get all profiles:', error);
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Get profile by ID
router.get('/:profileId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const profileId = parseInt(req.params.profileId, 10);
    if (isNaN(profileId)) {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: 'Invalid profile ID' });
    }
    const data = await ProfileController.getProfile(profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Update profile by ID
router.put('/:profileId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const profileId = parseInt(req.params.profileId, 10);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    
    if (isNaN(profileId)) {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: 'Invalid profile ID' });
    }
    
    const data = await ProfileController.updateProfile(profileId, req.body, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Delete profile by ID
// // Delete profile by ID
router.delete('/:profileId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const profileId = parseInt(req.params.profileId, 10);
    if (isNaN(profileId)) {
      return ResponseHandler.sendErrorResponse(res, { status: 400, message: 'Invalid profile ID' });
    }
    const data = await ProfileController.deleteProfile(profileId);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as ProfileRouter };
